import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      _count: {
        select: { orderItems: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Orders</h1>
      </div>

      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-overflow-hidden">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Order #</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Customer</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Date</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Status</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Items</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Total</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500 tw-text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="tw-px-6 tw-py-8 tw-text-center tw-text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:tw-bg-gray-50 tw-transition-colors">
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900 tw-font-mono">
                      {order.orderNumber}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      <div>{order.user.name}</div>
                      <div className="tw-text-xs tw-text-gray-400">{order.user.phone}</div>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="tw-px-6 tw-py-4">
                      <span
                        className={`tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-capitalize ${
                          order.status === "delivered"
                            ? "tw-bg-green-100 tw-text-green-800"
                            : order.status === "cancelled"
                            ? "tw-bg-red-100 tw-text-red-800"
                            : "tw-bg-yellow-100 tw-text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {order._count.orderItems} items
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="tw-h-8 tw-w-8 tw-text-gray-500">
                          <Eye size={16} />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
