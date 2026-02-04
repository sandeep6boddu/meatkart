import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { createClient } from '@/lib/supabase/server'
import { validateCoupon } from '@/app/actions/coupon'

type CheckoutItem = {
  productId: string
  weightId: string
  quantity: number
  cutType?: string
}

type CustomerInfo = {
  name: string
  email?: string
  phone: string
  address: string
  city: string
  pincode: string
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    const body = await req.json()
    const { items, customer, couponCode } = body as { 
      items: CheckoutItem[]; 
      customer: CustomerInfo;
      couponCode?: string;
    }

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!customer?.phone || !customer?.name || !customer?.address) {
      return NextResponse.json({ error: 'Missing required customer information' }, { status: 400 })
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/
    if (!phoneRegex.test(customer.phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    // SECURITY FIX: Fetch all product weights from database to calculate prices server-side
    const weightIds = items.map(item => item.weightId)
    const productWeights = await prisma.productWeight.findMany({
      where: {
        id: { in: weightIds },
        isActive: true,
        product: {
          isActive: true
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            isActive: true,
            stockQuantity: true
          }
        }
      }
    })

    // Create a map for quick lookup
    const weightMap = new Map(productWeights.map(w => [w.id, w]))

    // Validate all items exist and calculate server-side total
    let calculatedTotal = new Decimal(0)
    const orderItemsData: Array<{
      productId: string
      weightId: string
      quantity: number
      unitPrice: Decimal
      totalPrice: Decimal
      cutType?: string
    }> = []

    for (const item of items) {
      const weightData = weightMap.get(item.weightId)

      if (!weightData) {
        return NextResponse.json({
          error: `Product variant not found or unavailable: ${item.weightId}`
        }, { status: 400 })
      }

      if (weightData.product.id !== item.productId) {
        return NextResponse.json({
          error: 'Product and weight mismatch'
        }, { status: 400 })
      }

      if (!weightData.product.isActive) {
        return NextResponse.json({
          error: `Product ${weightData.product.name} is no longer available`
        }, { status: 400 })
      }

      // Use discount price if available, otherwise regular price
      const unitPrice = weightData.discountPrice ?? weightData.price
      const itemTotal = unitPrice.mul(item.quantity)

      calculatedTotal = calculatedTotal.add(itemTotal)

      orderItemsData.push({
        productId: item.productId,
        weightId: item.weightId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: itemTotal,
        cutType: item.cutType
      })
    }

    // Identify User Logic
    let user = null;

    // 1. Try to find by Auth Email (if logged in)
    if (authUser?.email) {
      user = await prisma.user.findFirst({
        where: { email: authUser.email }
      })
    }

    // 2. If not found by email, try to find by phone (Guest or Email not matching)
    if (!user) {
      user = await prisma.user.findUnique({
        where: { phone: customer.phone }
      })
    }

    // 3. If still not found, CREATE new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: customer.phone,
          name: customer.name,
          email: customer.email || authUser?.email || null,
          role: 'customer'
        }
      })
    }

    // --- COUPON VALIDATION ---
    let discountAmount = new Decimal(0)
    let appliedCouponId = null

    if (couponCode) {
      // Validate coupon with the found/created user ID
      const couponResult = await validateCoupon(couponCode, calculatedTotal.toNumber(), user.id)
      
      if (couponResult.valid && couponResult.discount && couponResult.couponId) {
        discountAmount = new Decimal(couponResult.discount)
        appliedCouponId = couponResult.couponId
        
        // Decrement coupon usage is handled in validation? No, validation only checks.
        // We need to increment usage count here if the order is successfully placed.
        // But we should do it transactionally ideally. 
        // For now, we'll assume it's valid and increment later or just proceed.
        // Actually, let's update the usage count after order creation.
      } else {
        // If coupon is invalid but code was provided, should we fail?
        // Or just ignore it? The frontend should have validated it.
        // Let's fail for safety if the client sent an invalid code expecting a discount.
        return NextResponse.json({
          error: `Invalid coupon: ${couponResult.message}`
        }, { status: 400 })
      }
    }

    const finalTotal = calculatedTotal.sub(discountAmount)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create Order with SERVER-CALCULATED total (not client-provided)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        totalAmount: finalTotal, // SECURITY: Using server-calculated total with discount
        status: 'pending',
        paymentMethod: 'COD',
        couponId: appliedCouponId,
        deliveryAddress: {
          street: customer.address,
          city: customer.city,
          pincode: customer.pincode,
          phone: customer.phone,
          name: customer.name
        },
        orderItems: {
          create: orderItemsData
        }
      }
    })

    // Increment coupon usage if applied
    if (appliedCouponId) {
      await prisma.coupon.update({
        where: { id: appliedCouponId },
        data: { usedCount: { increment: 1 } }
      })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: finalTotal.toNumber(),
      discountApplied: discountAmount.toNumber()
    })

  } catch (error: unknown) {
    // SECURITY FIX: Log error server-side but return generic message to client
    console.error('Checkout error:', error)

    return NextResponse.json({
      error: 'Unable to process your order. Please try again later.'
    }, { status: 500 })
  }
}
