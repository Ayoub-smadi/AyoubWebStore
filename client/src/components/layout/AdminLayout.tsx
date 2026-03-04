import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Package, ShoppingCart, Settings, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();

  if (!user || user.role !== 'admin') {
    setLocation("/");
    return null;
  }

  const navItems = [
    { href: "/admin", label: t('dashboard.title'), icon: LayoutDashboard },
    { href: "/admin/products", label: t('dashboard.products'), icon: Package },
    { href: "/admin/orders", label: t('dashboard.total_orders'), icon: ShoppingCart },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex z-10 shadow-xl shadow-black/5">
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}>
                    <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-border space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                Storefront
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => logout()} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-background/50">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
          
          <footer className="mt-auto py-8 border-t border-border bg-card/50">
            <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
              {t('home.copyright', { year: new Date().getFullYear() })}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
