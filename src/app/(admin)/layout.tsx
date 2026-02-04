import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../globals.css";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, FileBarChart, UserSquare2, MapPin } from "lucide-react";
import { Toaster } from "sonner";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { CacheClearButton } from "@/components/admin/CacheClearButton";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { ROLES, hasRole } from "@/lib/roles";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "MeatKart Admin",
  description: "Admin Dashboard for MeatKart",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check authentication
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (authError || !user) {
    redirect('/auth/login?redirect=/admin&message=Please login to access admin panel');
  }

  // Check if user has admin role in database
  // Check if user has admin role in database
  // We first try to find by phone if present in metadata
  let dbUser = null;

  if (user.phone) {
    dbUser = await prisma.user.findUnique({
      where: { phone: user.phone },
      select: { role: true, name: true, email: true }
    });
  }

  // If not found by phone, try by email
  if (!dbUser && user.email) {
    dbUser = await prisma.user.findFirst({
      where: { email: user.email },
      select: { role: true, name: true, email: true }
    });
  }

  // If user not found in database or not authorized, show access denied
  const authorizedRoles = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EDITOR];
  if (!dbUser || !authorizedRoles.includes(dbUser.role as any)) {
    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body suppressHydrationWarning>
          <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gray-50">
            <div className="tw-text-center tw-p-8 tw-bg-white tw-rounded-lg tw-shadow-lg tw-max-w-md">
              <div className="tw-text-red-500 tw-text-6xl tw-mb-4">🚫</div>
              <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2">Access Denied</h1>
              <p className="tw-text-gray-600 tw-mb-6">
                You don't have permission to access the admin panel.
              </p>
              <div className="tw-space-y-3">
                <Link
                  href="/"
                  className="tw-block tw-w-full tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded-lg hover:tw-bg-red-600 tw-transition-colors"
                >
                  Go to Homepage
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="tw-w-full tw-px-4 tw-py-2 tw-bg-gray-100 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-colors"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <div className="tw-flex tw-h-screen tw-bg-gray-50">
          {/* Sidebar */}
          <aside className="tw-w-64 tw-bg-white tw-shadow-xl tw-flex tw-flex-col tw-border-r tw-border-gray-200">
            <div className="tw-p-6 tw-border-b tw-border-gray-100 tw-bg-white">
              <div className="tw-flex tw-items-center tw-justify-center">
                <Link href="/">
                  <img src="/images/logo.png" alt="MeatKart" className="tw-h-12 tw-w-auto" />
                </Link>
              </div>
            </div>
            <nav className="tw-flex-1 tw-p-4 tw-space-y-1">
              <p className="tw-px-4 tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase tw-tracking-wider tw-mb-3 tw-mt-2">Menu</p>

              <Link
                href="/admin"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <LayoutDashboard size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Dashboard</span>
              </Link>

              {(hasRole(dbUser.role, ROLES.EDITOR) || hasRole(dbUser.role, ROLES.MANAGER)) && (
                <>
                  <Link
                    href="/admin/categories"
                    className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                  >
                    <Package size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                    <span className="tw-font-medium">Categories</span>
                  </Link>
                  <Link
                    href="/admin/products"
                    className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                  >
                    <Package size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                    <span className="tw-font-medium">Products</span>
                  </Link>
                  <Link
                    href="/admin/locations"
                    className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                  >
                    <MapPin size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                    <span className="tw-font-medium">Locations</span>
                  </Link>
                </>
              )}

              {hasRole(dbUser.role, ROLES.MANAGER) && (
                <>
                  <Link
                    href="/admin/orders"
                    className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                  >
                    <ShoppingCart size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                    <span className="tw-font-medium">Orders</span>
                  </Link>
                  <Link
                    href="/admin/customers"
                    className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                  >
                    <UserSquare2 size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                    <span className="tw-font-medium">Customers</span>
                  </Link>
                </>
              )}

              {hasRole(dbUser.role, ROLES.ADMIN) && (
                <Link
                  href="/admin/reports"
                  className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                >
                  <FileBarChart size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                  <span className="tw-font-medium">Reports</span>
                </Link>
              )}

              {hasRole(dbUser.role, ROLES.SUPER_ADMIN) && (
                <>
                  <p className="tw-px-4 tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase tw-tracking-wider tw-mt-8 tw-mb-3">System</p>
                  <Link
                    href="/admin/users"
                    className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                  >
                    <Users size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                    <span className="tw-font-medium">Admin Users</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
                  >
                    <Settings size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                    <span className="tw-font-medium">Settings</span>
                  </Link>
                </>
              )}
            </nav>
            <div className="tw-p-4 tw-border-t tw-border-gray-100 tw-space-y-1">
              <CacheClearButton />
              <LogoutButton />
            </div>
          </aside>

          {/* Main Content */}
          <main className="tw-flex-1 tw-overflow-y-auto tw-p-8 tw-bg-gray-50">
            <div className="tw-max-w-7xl tw-mx-auto">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
