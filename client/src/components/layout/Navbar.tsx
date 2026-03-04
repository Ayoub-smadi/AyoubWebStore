import { Link, useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, Moon, Sun, Languages } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [, setLocation] = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    // Force a re-render or layout update if needed, 
    // though i18next and react-i18next usually handle this.
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-x-0 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight hidden sm:block">
                Ayoub<span className="text-primary">.</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('nav.home')}</Link>
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('nav.shop')}</Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full">
              <Languages className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Link href="/cart" className="relative group">
              <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary/10">
                <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80">
                    <span className="font-display font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                  <div className="px-2 py-2 mb-2">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/profile")} className="cursor-pointer rounded-md py-2">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{t('nav.profile')}</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => setLocation("/admin")} className="cursor-pointer rounded-md py-2">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{t('nav.admin')}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive rounded-md py-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all">
                  {t('nav.signin')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
