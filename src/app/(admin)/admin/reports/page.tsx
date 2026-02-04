import prisma from "@/lib/prisma";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  // Calculate basic stats
  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: 'delivered' }
  });

  const totalOrders = await prisma.order.count();
  
  const pendingOrders = await prisma.order.count({
    where: { status: 'pending' }
  });

  const totalCustomers = await prisma.user.count({
    where: { role: 'customer' }
  });

  // Recent Orders for Report
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className="tw-space-y-8">
      <div>
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Reports & Analytics</h1>
        <p className="tw-text-gray-500 tw-mt-1">Performance overview and sales reports</p>
      </div>

      <div className="tw-grid tw-gap-6 md:tw-grid-cols-2 lg:tw-grid-cols-4">
        <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 className="tw-text-sm tw-font-medium tw-text-gray-500">Total Revenue</h3>
            <div className="tw-p-2 tw-bg-green-100 tw-rounded-lg">
              <DollarSign className="tw-h-5 tw-w-5 tw-text-green-600" />
            </div>
          </div>
          <div className="tw-text-2xl tw-font-bold tw-text-gray-900">
            ₹{Number(totalRevenue._sum.totalAmount || 0).toLocaleString()}
          </div>
          <p className="tw-text-xs tw-text-green-600 tw-mt-1">Lifetime earnings</p>
        </div>

        <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 className="tw-text-sm tw-font-medium tw-text-gray-500">Total Orders</h3>
            <div className="tw-p-2 tw-bg-blue-100 tw-rounded-lg">
              <ShoppingCart className="tw-h-5 tw-w-5 tw-text-blue-600" />
            </div>
          </div>
          <div className="tw-text-2xl tw-font-bold tw-text-gray-900">
            {totalOrders}
          </div>
          <p className="tw-text-xs tw-text-blue-600 tw-mt-1">{pendingOrders} pending processing</p>
        </div>

        <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 className="tw-text-sm tw-font-medium tw-text-gray-500">Total Customers</h3>
            <div className="tw-p-2 tw-bg-purple-100 tw-rounded-lg">
              <Users className="tw-h-5 tw-w-5 tw-text-purple-600" />
            </div>
          </div>
          <div className="tw-text-2xl tw-font-bold tw-text-gray-900">
            {totalCustomers}
          </div>
          <p className="tw-text-xs tw-text-purple-600 tw-mt-1">Registered users</p>
        </div>

        <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 className="tw-text-sm tw-font-medium tw-text-gray-500">Growth</h3>
            <div className="tw-p-2 tw-bg-orange-100 tw-rounded-lg">
              <TrendingUp className="tw-h-5 tw-w-5 tw-text-orange-600" />
            </div>
          </div>
          <div className="tw-text-2xl tw-font-bold tw-text-gray-900">
            +12.5%
          </div>
          <p className="tw-text-xs tw-text-orange-600 tw-mt-1">Since last month</p>
        </div>
      </div>

      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
        <div className="tw-p-6 tw-border-b tw-border-gray-100">
          <h3 className="tw-font-bold tw-text-lg tw-text-gray-900">Recent Transactions Report</h3>
        </div>
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Order ID</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Customer</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Date</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Amount</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:tw-bg-gray-50">
                  <td className="tw-px-6 tw-py-4 tw-font-mono tw-text-gray-600">
                    {order.orderNumber}
                  </td>
                  <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                    {order.user.name}
                  </td>
                  <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="tw-px-6 tw-py-4">
                    <span className={`tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-capitalize ${
                      order.status === 'delivered' ? 'tw-bg-green-100 tw-text-green-800' :
                      order.status === 'pending' ? 'tw-bg-yellow-100 tw-text-yellow-800' :
                      'tw-bg-red-100 tw-text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
