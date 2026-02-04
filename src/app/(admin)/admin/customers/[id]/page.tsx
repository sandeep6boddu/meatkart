import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Package, MapPin, CreditCard, ShoppingBag, User } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CustomerDetailsPage({ params }: PageProps) {
    const { id } = await params;

    const customer = await prisma.user.findUnique({
        where: { id },
        include: {
            addresses: true,
            orders: {
                orderBy: { createdAt: 'desc' },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                            productWeight: true
                        }
                    },
                    payment: true,
                    delivery: true
                }
            },
            wallet: true,
            _count: {
                select: { orders: true }
            }
        }
    });

    if (!customer) {
        notFound();
    }

    const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const averageOrderValue = customer._count.orders > 0 ? totalSpent / customer._count.orders : 0;

    return (
        <div className="tw-space-y-6">
            <div className="tw-flex tw-items-center tw-justify-between">
                <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Customer Details</h1>
                <div className="tw-text-sm tw-text-gray-500">
                    Joined {format(new Date(customer.createdAt), "PPP")}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
                {/* Profile Card */}
                <Card>
                    <CardHeader className="tw-flex tw-flex-row tw-items-center tw-space-y-0 tw-pb-2">
                        <CardTitle className="tw-text-sm tw-font-medium">Profile</CardTitle>
                        <User className="tw-ml-auto tw-h-4 tw-w-4 tw-text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="tw-text-2xl tw-font-bold">{customer.name}</div>
                        <div className="tw-text-sm tw-text-gray-500 tw-mt-1">{customer.email}</div>
                        <div className="tw-text-sm tw-text-gray-500">{customer.phone}</div>
                        <div className="tw-mt-4 tw-flex tw-gap-2">
                            <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                                {customer.role.toUpperCase()}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Card */}
                <Card>
                    <CardHeader className="tw-flex tw-flex-row tw-items-center tw-space-y-0 tw-pb-2">
                        <CardTitle className="tw-text-sm tw-font-medium">Statistics</CardTitle>
                        <ShoppingBag className="tw-ml-auto tw-h-4 tw-w-4 tw-text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                            <div>
                                <div className="tw-text-sm tw-text-gray-500">Total Orders</div>
                                <div className="tw-text-2xl tw-font-bold">{customer._count.orders}</div>
                            </div>
                            <div>
                                <div className="tw-text-sm tw-text-gray-500">Total Spent</div>
                                <div className="tw-text-2xl tw-font-bold">₹{totalSpent.toFixed(2)}</div>
                            </div>
                            <div>
                                <div className="tw-text-sm tw-text-gray-500">Avg. Order</div>
                                <div className="tw-text-2xl tw-font-bold">₹{averageOrderValue.toFixed(2)}</div>
                            </div>
                            <div>
                                <div className="tw-text-sm tw-text-gray-500">Wallet Balance</div>
                                <div className="tw-text-2xl tw-font-bold">₹{Number(customer.wallet?.balance || 0).toFixed(2)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Addresses Card */}
                <Card>
                    <CardHeader className="tw-flex tw-flex-row tw-items-center tw-space-y-0 tw-pb-2">
                        <CardTitle className="tw-text-sm tw-font-medium">Addresses</CardTitle>
                        <MapPin className="tw-ml-auto tw-h-4 tw-w-4 tw-text-gray-500" />
                    </CardHeader>
                    <CardContent className="tw-max-h-[200px] tw-overflow-y-auto">
                        {customer.addresses.length === 0 ? (
                            <div className="tw-text-sm tw-text-gray-500">No addresses found</div>
                        ) : (
                            <div className="tw-space-y-3">
                                {customer.addresses.map((addr) => (
                                    <div key={addr.id} className="tw-text-sm tw-border-l-2 tw-border-gray-200 tw-pl-3">
                                        <div className="tw-font-medium">{addr.type || 'Home'} {addr.isDefault && <span className="tw-text-xs tw-text-green-600">(Default)</span>}</div>
                                        <div className="tw-text-gray-600">
                                            {addr.street}, {addr.city}
                                            <br />
                                            {addr.state} - {addr.pincode}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Orders List */}
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                    {customer.orders.length === 0 ? (
                        <div className="tw-text-center tw-py-8 tw-text-gray-500">No orders placed yet.</div>
                    ) : (
                        <div className="tw-overflow-x-auto">
                            <table className="tw-w-full tw-text-left tw-text-sm">
                                <thead className="tw-bg-gray-50 tw-border-b">
                                    <tr>
                                        <th className="tw-px-4 tw-py-3 tw-font-medium">Order ID</th>
                                        <th className="tw-px-4 tw-py-3 tw-font-medium">Date</th>
                                        <th className="tw-px-4 tw-py-3 tw-font-medium">Status</th>
                                        <th className="tw-px-4 tw-py-3 tw-font-medium">Payment</th>
                                        <th className="tw-px-4 tw-py-3 tw-font-medium">Items</th>
                                        <th className="tw-px-4 tw-py-3 tw-font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="tw-divide-y">
                                    {customer.orders.map((order) => (
                                        <tr key={order.id} className="hover:tw-bg-gray-50">
                                            <td className="tw-px-4 tw-py-3 tw-font-mono">{order.orderNumber}</td>
                                            <td className="tw-px-4 tw-py-3 text-gray-600">{format(new Date(order.createdAt), "MMM d, yyyy")}</td>
                                            <td className="tw-px-4 tw-py-3">
                                                <Badge variant="outline" className="tw-capitalize">{order.status}</Badge>
                                            </td>
                                            <td className="tw-px-4 tw-py-3">
                                                <div className="tw-capitalize">{order.paymentMethod}</div>
                                                <div className={`tw-text-xs ${order.paymentStatus === 'completed' || order.paymentStatus === 'paid' ? 'tw-text-green-600' : 'tw-text-amber-600'}`}>
                                                    {order.paymentStatus}
                                                </div>
                                            </td>
                                            <td className="tw-px-4 tw-py-3 tw-text-gray-600">
                                                {order.orderItems.length} items
                                                <div className="tw-text-xs tw-text-gray-400 tw-truncate tw-max-w-[200px]">
                                                    {order.orderItems.map(i => i.product.name).join(', ')}
                                                </div>
                                            </td>
                                            <td className="tw-px-4 tw-py-3 tw-font-medium">₹{Number(order.totalAmount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
