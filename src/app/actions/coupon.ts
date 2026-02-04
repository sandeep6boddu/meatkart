'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CouponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(50),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().min(0),
  minOrderValue: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  usageLimit: z.coerce.number().min(1).optional().nullable(),
  perUserLimit: z.coerce.number().min(1).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CouponState = {
  error?: {
    code?: string[];
    description?: string[];
    discountType?: string[];
    discountValue?: string[];
    minOrderValue?: string[];
    maxDiscount?: string[];
    startDate?: string[];
    endDate?: string[];
    usageLimit?: string[];
    perUserLimit?: string[];
    isActive?: string[];
    [key: string]: string[] | undefined;
  } | string;
  message?: string;
} | null;

export async function createCoupon(prevState: CouponState, formData: FormData): Promise<CouponState> {
  const validatedFields = CouponSchema.safeParse({
    code: formData.get("code"),
    description: formData.get("description"),
    discountType: formData.get("discountType"),
    discountValue: formData.get("discountValue"),
    minOrderValue: formData.get("minOrderValue") || undefined,
    maxDiscount: formData.get("maxDiscount") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || null,
    usageLimit: formData.get("usageLimit") || null,
    perUserLimit: formData.get("perUserLimit") || null,
    isActive: formData.get("isActive") === "on",
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await prisma.coupon.create({
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return { error: "Failed to create coupon. Code might already exist." };
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(id: string, prevState: CouponState, formData: FormData): Promise<CouponState> {
  const validatedFields = CouponSchema.safeParse({
    code: formData.get("code"),
    description: formData.get("description"),
    discountType: formData.get("discountType"),
    discountValue: formData.get("discountValue"),
    minOrderValue: formData.get("minOrderValue") || undefined,
    maxDiscount: formData.get("maxDiscount") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || null,
    usageLimit: formData.get("usageLimit") || null,
    perUserLimit: formData.get("perUserLimit") || null,
    isActive: formData.get("isActive") === "on",
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await prisma.coupon.update({
      where: { id },
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return { error: "Failed to update coupon." };
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({
      where: { id },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return { error: "Failed to delete coupon." };
  }
}

export async function validateCoupon(code: string, cartTotal: number, userId?: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { valid: false, message: "Coupon is inactive" };
    }

    const now = new Date();
    if (now < coupon.startDate) {
      return { valid: false, message: "Coupon is not yet valid" };
    }

    if (coupon.endDate && now > coupon.endDate) {
      return { valid: false, message: "Coupon has expired" };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: "Coupon usage limit reached" };
    }

    if (coupon.minOrderValue && cartTotal < Number(coupon.minOrderValue)) {
      return { 
        valid: false, 
        message: `Minimum order value of ₹${coupon.minOrderValue} required` 
      };
    }

    if (userId && coupon.perUserLimit) {
      const userUsage = await prisma.order.count({
        where: {
          userId,
          couponId: coupon.id,
        },
      });

      if (userUsage >= coupon.perUserLimit) {
        return { valid: false, message: "You have already used this coupon" };
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (cartTotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
        discount = Number(coupon.maxDiscount);
      }
    } else {
      discount = Number(coupon.discountValue);
    }

    // Ensure discount doesn't exceed total
    if (discount > cartTotal) {
      discount = cartTotal;
    }

    return { 
      valid: true, 
      discount, 
      couponId: coupon.id,
      code: coupon.code,
      message: "Coupon applied successfully" 
    };

  } catch (error) {
    console.error("Failed to validate coupon:", error);
    return { valid: false, message: "Error validating coupon" };
  }
}
