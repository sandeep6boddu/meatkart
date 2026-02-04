import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MeatKart is one of the premium online meat delivery website in Hyderabad, India.",
  description: "Shop for high quality halal cut ready to eat or cook, marinated boiler, organic free range or country Chicken, Lamb or Sea Food now for quick delivery and at best prices.",
  keywords: "MeatKart, Mutton, Chicken, Fish, Buy, Online"
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" type="text/css" />
        <link href="/css/mediaqueries.css" rel="stylesheet" type="text/css" />
        <link href="/css/mobile-app.css" rel="stylesheet" type="text/css" />
        <link href="/css/mobile-responsive.css" rel="stylesheet" type="text/css" />
      </head>
      <body suppressHydrationWarning>
        <div className="page">
          {/* Desktop Header: Hidden on mobile via CSS (Bootstrap 3) */}
          <div className="hidden-xs">
            <Header />
          </div>

          {/* Mobile Header: Visible only on mobile via CSS (Bootstrap 3) */}
          <div className="visible-xs">
            <MobileHeader />
            <div style={{ height: '60px' }}></div> {/* Spacer for fixed header */}
          </div>

          <main style={{ paddingBottom: '60px' }}>
            {children}
          </main>

          {/* Desktop Footer: Hidden on mobile via CSS */}
          <div className="d-none d-md-block">
            <Footer />
          </div>

          {/* Mobile Bottom Nav */}
          <div className="visible-xs">
            <MobileBottomNav />
          </div>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
