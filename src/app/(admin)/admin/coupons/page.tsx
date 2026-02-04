import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteCoupon } from "@/app/actions/coupon";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="tw-p-6">
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <h1 className="tw-text-2xl tw-font-bold">Coupons</h1>
        <Link href="/admin/coupons/new">
          <Button>
            <Plus className="tw-mr-2 tw-h-4 tw-w-4" /> Create Coupon
          </Button>
        </Link>
      </div>

      <div className="tw-bg-white tw-rounded-lg tw-shadow tw-overflow-hidden">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead className="tw-bg-gray-50">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Code
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Discount
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Usage
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Status
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Dates
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-right tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-font-medium tw-text-gray-900">{coupon.code}</div>
                  <div className="tw-text-sm tw-text-gray-500">{coupon.description}</div>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-text-sm tw-text-gray-900">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${Number(coupon.discountValue)}%`
                      : `₹${Number(coupon.discountValue)}`}
                  </div>
                  {coupon.minOrderValue && (
                    <div className="tw-text-xs tw-text-gray-500">
                      Min Order: ₹{Number(coupon.minOrderValue)}
                    </div>
                  )}
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-text-sm tw-text-gray-900">
                    {coupon.usedCount} / {coupon.usageLimit ? coupon.usageLimit : "∞"}
                  </div>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <span
                    className={`tw-px-2 tw-inline-flex tw-text-xs tw-leading-5 tw-font-semibold tw-rounded-full ${
                      coupon.isActive
                        ? "tw-bg-green-100 tw-text-green-800"
                        : "tw-bg-red-100 tw-text-red-800"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-text-gray-500">
                  <div>Start: {new Date(coupon.startDate).toLocaleDateString()}</div>
                  {coupon.endDate && (
                    <div>End: {new Date(coupon.endDate).toLocaleDateString()}</div>
                  )}
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-right tw-text-sm tw-font-medium">
                  <div className="tw-flex tw-justify-end tw-gap-2">
                    <Link href={`/admin/coupons/${coupon.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="tw-h-4 tw-w-4" />
                      </Button>
                    </Link>
                    <form action={async () => {
                      "use server"
                      await deleteCoupon(coupon.id)
                    }}>
                      <Button variant="ghost" size="icon" className="tw-text-red-600 hover:tw-text-red-900 hover:tw-bg-red-50">
                        <Trash2 className="tw-h-4 tw-w-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <div className="tw-text-center tw-py-10 tw-text-gray-500">
            No coupons found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
