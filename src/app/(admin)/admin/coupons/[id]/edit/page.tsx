import { CouponForm } from "@/components/admin/coupons/CouponForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: PageProps) {
    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({
        where: { id },
    });

    if (!coupon) {
        notFound();
    }

    // Transform Prisma Decimal to number for the form
    const formattedCoupon = {
        ...coupon,
        discountValue: Number(coupon.discountValue),
        minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    };

    return (
        <div className="tw-space-y-6">
            <div>
                <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Edit Coupon</h1>
                <p className="tw-text-gray-500 tw-mt-2">Update coupon details</p>
            </div>
            <CouponForm coupon={formattedCoupon} />
        </div>
    );
}
