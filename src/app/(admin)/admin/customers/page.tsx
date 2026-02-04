import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  // Fetch users with 'customer' role
  const customers = await prisma.user.findMany({
    where: { role: 'customer' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      },
      orders: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, totalAmount: true }
      }
    }
  });

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Customers</h1>
      </div>

      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-overflow-hidden">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Name</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Contact</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Total Orders</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Last Order</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="tw-px-6 tw-py-8 tw-text-center tw-text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:tw-bg-gray-50 tw-transition-colors">
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      <a href={`/admin/customers/${customer.id}`} className="hover:tw-text-primary hover:tw-underline tw-block tw-w-full tw-h-full">
                        {customer.name}
                      </a>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      <div>{customer.email}</div>
                      <div className="tw-text-xs tw-text-gray-400">{customer.phone}</div>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {customer._count.orders}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {customer.orders[0]
                        ? (
                          <div>
                            <div>{new Date(customer.orders[0].createdAt).toLocaleDateString()}</div>
                            <div className="tw-text-xs tw-text-gray-400">₹{Number(customer.orders[0].totalAmount).toFixed(2)}</div>
                          </div>
                        )
                        : 'Never'}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {new Date(customer.createdAt).toLocaleDateString()}
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
