import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import { HomePage } from "@/pages/public/HomePage";
import { ProductsPage } from "@/pages/public/ProductsPage";
import { ProductDetailsPage } from "@/pages/public/ProductDetailsPage";
import { CartPage } from "@/pages/public/CartPage";
import { CheckoutPage } from "@/pages/public/CheckoutPage";
import { ProfilePage } from "@/pages/public/ProfilePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { ProductsAdminPage } from "@/pages/admin/ProductsAdminPage";
import { OrdersAdminPage } from "@/pages/admin/OrdersAdminPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={HomePage}/>
      <Route path="/products" component={ProductsPage}/>
      <Route path="/products/:id" component={ProductDetailsPage}/>
      <Route path="/cart" component={CartPage}/>
      <Route path="/checkout" component={CheckoutPage}/>
      <Route path="/profile" component={ProfilePage}/>
      
      {/* Auth */}
      <Route path="/login" component={LoginPage}/>
      <Route path="/register" component={RegisterPage}/>

      {/* Admin Pages */}
      <Route path="/admin" component={DashboardPage}/>
      <Route path="/admin/products" component={ProductsAdminPage}/>
      <Route path="/admin/orders" component={OrdersAdminPage}/>
      <Route path="/admin/settings" component={SettingsPage}/>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
