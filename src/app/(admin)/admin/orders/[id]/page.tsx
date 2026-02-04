import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/orders/OrderStatusSelect";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Phone, Mail, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
          productWeight: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const deliveryAddress = order.deliveryAddress as any;

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-items-center tw-gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="tw-text-sm tw-text-gray-500">
              Placed on {format(new Date(order.createdAt), "PPP p")}
            </p>
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-4">
           <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6">
        <div className="lg:tw-col-span-2 tw-space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="tw-space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="tw-flex tw-items-center tw-justify-between tw-border-b tw-pb-4 last:tw-border-0 last:tw-pb-0">
                    <div className="tw-flex tw-items-center tw-gap-4">
                      <div className="tw-h-16 tw-w-16 tw-bg-gray-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                        {/* Placeholder for product image if we had one here */}
                         <span className="tw-text-xs tw-text-gray-400">Img</span>
                      </div>
                      <div>
                        <p className="tw-font-medium tw-text-gray-900">{item.product.name}</p>
                        <p className="tw-text-sm tw-text-gray-500">
                          {item.productWeight.weight} • {item.cutType || 'Standard Cut'}
                        </p>
                      </div>
                    </div>
                    <div className="tw-text-right">
                      <p className="tw-font-medium tw-text-gray-900">₹{Number(item.totalPrice).toFixed(2)}</p>
                      <p className="tw-text-sm tw-text-gray-500">
                        {item.quantity} x ₹{Number(item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="tw-my-4" />
              <div className="tw-space-y-2">
                <div className="tw-flex tw-justify-between tw-text-sm">
                  <span className="tw-text-gray-500">Subtotal</span>
                  <span className="tw-font-medium">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className="tw-flex tw-justify-between tw-text-sm">
                  <span className="tw-text-gray-500">Delivery Fee</span>
                  <span className="tw-font-medium">₹0.00</span>
                </div>
                <Separator className="tw-my-2" />
                <div className="tw-flex tw-justify-between tw-text-base tw-font-bold">
                  <span>Total</span>
                  <span>₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="tw-space-y-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <div className="tw-flex tw-items-start tw-gap-3">
                <User size={18} className="tw-text-gray-400 tw-mt-1" />
                <div>
                  <p className="tw-font-medium tw-text-gray-900">{order.user.name}</p>
                  <p className="tw-text-sm tw-text-gray-500">Customer ID: {order.user.id.slice(0, 8)}...</p>
                </div>
              </div>
              <div className="tw-flex tw-items-start tw-gap-3">
                <Mail size={18} className="tw-text-gray-400 tw-mt-1" />
                <p className="tw-text-sm tw-text-gray-600">{order.user.email || 'No email provided'}</p>
              </div>
              <div className="tw-flex tw-items-start tw-gap-3">
                <Phone size={18} className="tw-text-gray-400 tw-mt-1" />
                <p className="tw-text-sm tw-text-gray-600">{order.user.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="tw-flex tw-items-start tw-gap-3">
                <MapPin size={18} className="tw-text-gray-400 tw-mt-1" />
                <div className="tw-text-sm tw-text-gray-600">
                  <p className="tw-font-medium tw-text-gray-900 tw-mb-1">
                    {deliveryAddress?.name || order.user.name}
                  </p>
                  <p>{deliveryAddress?.street}</p>
                  <p>{deliveryAddress?.city}, {deliveryAddress?.state}</p>
                  <p>{deliveryAddress?.pincode}</p>
                  <p className="tw-mt-1">Phone: {deliveryAddress?.phone || order.user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

           {/* Payment Info */}
           <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="tw-flex tw-items-start tw-gap-3">
                <CreditCard size={18} className="tw-text-gray-400 tw-mt-1" />
                <div>
                  <p className="tw-font-medium tw-text-gray-900 tw-capitalize">
                    {order.paymentMethod}
                  </p>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="tw-mt-2">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
