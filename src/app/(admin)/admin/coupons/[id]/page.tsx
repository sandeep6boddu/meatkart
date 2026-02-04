import prisma from "@/lib/prisma";
import { CouponForm } from "@/components/admin/coupons/CouponForm";
import { notFound } from "next/navigation";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!coupon) {
    notFound();
  }

  // Convert Prisma Decimals to numbers for the form
  const formattedCoupon = {
    ...coupon,
    discountValue: Number(coupon.discountValue),
    minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
    maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
  };

  return (
    <div className="tw-p-6">
      <div className="tw-mb-6">
        <h1 className="tw-text-2xl tw-font-bold">Edit Coupon</h1>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-6 tw-max-w-2xl">
        <CouponForm coupon={formattedCoupon} />
      </div>
    </div>
  );
}
