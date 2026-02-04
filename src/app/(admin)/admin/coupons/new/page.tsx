import { CouponForm } from "@/components/admin/coupons/CouponForm";

export default function NewCouponPage() {
  return (
    <div className="tw-p-6">
      <div className="tw-mb-6">
        <h1 className="tw-text-2xl tw-font-bold">Create New Coupon</h1>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-6 tw-max-w-2xl">
        <CouponForm />
      </div>
    </div>
  );
}
