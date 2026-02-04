import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { PrintInvoiceButton } from '@/components/account/PrintInvoiceButton'

export const dynamic = 'force-dynamic';

interface InvoicePageProps {
  params: Promise<{ id: string }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return notFound()

  const order = await prisma.order.findFirst({
    where: { 
      id: id,
      user: { email: authUser.email }
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
          productWeight: true
        }
      }
    }
  })

  if (!order) return notFound()

  // Parsing delivery address if it's stored as JSON
  const deliveryAddress = order.deliveryAddress as any || {}

  return (
    <div className="tw-bg-white tw-min-h-screen tw-p-8 tw-text-black">
      {/* Styles for print */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; }
          body { margin: 1.6cm; }
          .no-print { display: none; }
        }
      `}} />

      <div className="tw-max-w-[800px] tw-mx-auto tw-border tw-p-8">
        {/* Header */}
        <div className="tw-flex tw-justify-between tw-items-start tw-mb-8 tw-border-b tw-pb-8">
          <div>
            <h1 className="tw-text-3xl tw-font-bold tw-text-primary tw-mb-2">Meatkart</h1>
            <p className="tw-text-sm tw-text-gray-500">Order by Phone: 040 64629595</p>
          </div>
          <div className="tw-text-right">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-1">INVOICE</h2>
            <p className="tw-text-sm tw-text-gray-500">#{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="tw-grid tw-grid-cols-2 tw-gap-8 tw-mb-8">
          <div>
            <h3 className="tw-font-bold tw-mb-4 tw-uppercase tw-text-sm tw-tracking-wider">Order Details</h3>
            <div className="tw-space-y-2 tw-text-sm">
              <div className="tw-flex tw-gap-2">
                <span className="tw-text-gray-500 tw-w-24">Order ID:</span>
                <span className="tw-font-medium">{order.orderNumber}</span>
              </div>
              <div className="tw-flex tw-gap-2">
                <span className="tw-text-gray-500 tw-w-24">Order Date:</span>
                <span className="tw-font-medium">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="tw-flex tw-gap-2">
                <span className="tw-text-gray-500 tw-w-24">Amount Paid:</span>
                <span className="tw-font-medium">₹{Number(order.totalAmount).toFixed(2)} ({order.paymentMethod})</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="tw-font-bold tw-mb-4 tw-uppercase tw-text-sm tw-tracking-wider">Shipping Address</h3>
            <div className="tw-text-sm tw-space-y-1">
              <p className="tw-font-bold">{order.user.name}</p>
              <p>{deliveryAddress.street}</p>
              <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</p>
              {deliveryAddress.landmark && <p>Landmark: {deliveryAddress.landmark}</p>}
              <p className="tw-mt-2">Phone: {order.user.phone}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="tw-mb-8">
          <h3 className="tw-font-bold tw-mb-4 tw-uppercase tw-text-sm tw-tracking-wider">Order Summary</h3>
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-py-3 tw-px-4">Product</th>
                <th className="tw-py-3 tw-px-4">Quantity</th>
                <th className="tw-py-3 tw-px-4 tw-text-right">Price</th>
                <th className="tw-py-3 tw-px-4 tw-text-right">Total</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="tw-py-3 tw-px-4">
                    <p className="tw-font-medium">{item.product.name}</p>
                    <p className="tw-text-xs tw-text-gray-500">{item.productWeight.weight}</p>
                  </td>
                  <td className="tw-py-3 tw-px-4">{item.quantity}</td>
                  <td className="tw-py-3 tw-px-4 tw-text-right">₹{Number(item.unitPrice).toFixed(2)}</td>
                  <td className="tw-py-3 tw-px-4 tw-text-right">₹{Number(item.totalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="tw-border-t-2 tw-border-gray-200">
              <tr>
                <td colSpan={3} className="tw-py-4 tw-px-4 tw-text-right tw-font-bold">Total Amount:</td>
                <td className="tw-py-4 tw-px-4 tw-text-right tw-font-bold tw-text-lg">₹{Number(order.totalAmount).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="tw-border-t tw-pt-8 tw-flex tw-justify-between tw-items-center">
            <div className="tw-text-sm tw-text-gray-500">
                <p>Thank you for shopping with Meatkart!</p>
                <p>For support, email support@meatkart.com</p>
            </div>
            <div className="no-print">
                <button 
                    onClick={() => window.print()} 
                    className="tw-bg-primary tw-text-white tw-px-4 tw-py-2 tw-rounded tw-flex tw-items-center tw-gap-2 hover:tw-bg-primary/90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Print Invoice
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}
