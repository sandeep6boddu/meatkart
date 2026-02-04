import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, CreditCard, Activity } from "lucide-react";

export default function AdminDashboard() {
  // Mock data for now
  const stats = [
    {
      title: "Total Revenue",
      value: "₹45,231.89",
      icon: DollarSign,
      description: "+20.1% from last month",
      color: "tw-bg-primary",
      iconBg: "tw-bg-white/20",
    },
    {
      title: "Orders",
      value: "+2350",
      icon: ShoppingCart,
      description: "+180.1% from last month",
      color: "tw-bg-gray-800",
      iconBg: "tw-bg-white/20",
    },
    {
      title: "Products",
      value: "12",
      icon: Package,
      description: "12 active products",
      color: "tw-bg-white tw-border tw-border-gray-200",
      textColor: "tw-text-gray-900",
      iconColor: "tw-text-primary",
      iconBg: "tw-bg-red-50",
      descriptionColor: "tw-text-gray-500"
    },
    {
      title: "Active Users",
      value: "+573",
      icon: Users,
      description: "+201 since last hour",
      color: "tw-bg-white tw-border tw-border-gray-200",
      textColor: "tw-text-gray-900",
      iconColor: "tw-text-gray-600",
      iconBg: "tw-bg-gray-100",
      descriptionColor: "tw-text-gray-500"
    },
  ];

  return (
    <div className="tw-space-y-8">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div>
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900 tw-tracking-tight">Dashboard</h1>
          <p className="tw-text-gray-500 tw-mt-1">Overview of your store's performance</p>
        </div>
        <div className="tw-flex tw-gap-2">
            <button className="tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50 tw-transition-colors">
                Export
            </button>
            <button className="tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded-lg tw-text-sm tw-font-medium hover:tw-bg-red-600 tw-transition-colors">
                Download Report
            </button>
        </div>
      </div>
      
      <div className="tw-grid tw-gap-6 md:tw-grid-cols-2 lg:tw-grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className={`tw-p-6 tw-rounded-2xl tw-shadow-sm ${stat.color} tw-transition-transform hover:tw-scale-[1.02] tw-cursor-default`}>
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
              <div className={`tw-p-3 tw-rounded-xl ${stat.iconBg} tw-backdrop-blur-sm`}>
                <stat.icon className={`tw-h-6 tw-w-6 ${stat.iconColor || 'tw-text-white'}`} />
              </div>
              <span className={`tw-text-xs tw-font-medium ${stat.textColor ? 'tw-bg-gray-100 tw-text-gray-600' : 'tw-bg-white/20 tw-text-white'} tw-px-2 tw-py-1 tw-rounded-full`}>
                 {stat.description.split(' ')[0]}
              </span>
            </div>
            <div>
              <p className={`tw-text-sm tw-font-medium ${stat.textColor || 'tw-text-white/80'}`}>
                {stat.title}
              </p>
              <h3 className={`tw-text-3xl tw-font-bold tw-mt-1 ${stat.textColor || 'tw-text-white'}`}>{stat.value}</h3>
              <p className={`tw-text-xs tw-mt-2 ${stat.descriptionColor || 'tw-text-white/70'}`}>
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="tw-grid tw-gap-6 md:tw-grid-cols-2 lg:tw-grid-cols-7">
        <div className="tw-col-span-4 tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div>
                <h3 className="tw-font-bold tw-text-lg tw-text-gray-900">Revenue Overview</h3>
                <p className="tw-text-sm tw-text-gray-500">Monthly revenue analytics</p>
            </div>
            <div className="tw-p-2 tw-bg-red-50 tw-rounded-lg">
                <TrendingUp className="tw-h-5 tw-w-5 tw-text-primary" />
            </div>
          </div>
          <div className="tw-h-[300px] tw-flex tw-items-center tw-justify-center tw-text-gray-400 tw-bg-gray-50/50 tw-rounded-xl tw-border tw-border-dashed tw-border-gray-200">
            <div className="tw-text-center">
                <Activity className="tw-h-8 tw-w-8 tw-mx-auto tw-mb-2 tw-text-gray-300" />
                <span className="tw-text-sm">Chart Visualization Placeholder</span>
            </div>
          </div>
        </div>
        
        <div className="tw-col-span-3 tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
             <div>
                <h3 className="tw-font-bold tw-text-lg tw-text-gray-900">Recent Sales</h3>
                <p className="tw-text-sm tw-text-gray-500">Latest successful transactions</p>
             </div>
             <div className="tw-p-2 tw-bg-gray-100 tw-rounded-lg">
                <CreditCard className="tw-h-5 tw-w-5 tw-text-gray-600" />
             </div>
          </div>
          <div className="tw-space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="tw-flex tw-items-center tw-p-3 hover:tw-bg-gray-50 tw-rounded-xl tw-transition-colors">
                <div className="tw-h-10 tw-w-10 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-border tw-border-white tw-shadow-sm">
                   <span className="tw-font-semibold tw-text-gray-600 tw-text-xs">OM</span>
                </div>
                <div className="tw-ml-4 tw-space-y-0.5">
                  <p className="tw-text-sm tw-font-semibold tw-text-gray-900">
                    Olivia Martin
                  </p>
                  <p className="tw-text-xs tw-text-gray-500">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="tw-ml-auto tw-font-bold tw-text-sm tw-text-gray-900">+₹1,999.00</div>
              </div>
            ))}
          </div>
          <button className="tw-w-full tw-mt-6 tw-py-2 tw-text-sm tw-font-medium tw-text-primary tw-bg-red-50 hover:tw-bg-red-100 tw-rounded-lg tw-transition-colors">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
