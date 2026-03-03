import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/use-orders";
import { formatJOD } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const SHIPPING_COST = 5.00;
  const subtotal = getTotal();
  const total = subtotal + SHIPPING_COST;

  const [address, setAddress] = useState("");

  if (items.length === 0) {
    setLocation('/cart');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "Login required", description: "Please sign in to complete your order." });
      setLocation('/login?redirect=/checkout');
      return;
    }
    
    try {
      await createOrder({
        totalAmount: total,
        shippingCost: SHIPPING_COST,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          priceAtTime: Number(item.product.price)
        }))
      });
      
      clearCart();
      toast({ title: "Order Confirmed!", description: "Your order has been placed successfully." });
      setLocation('/profile');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Checkout Failed", description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order details below.</p>
            </div>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><Truck className="h-5 w-5" /></div>
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required className="bg-background h-12" defaultValue={user?.username || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required className="bg-background h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input id="address" required placeholder="Street, Building, Apartment" className="bg-background h-12" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City / Governorate</Label>
                      <Input id="city" required defaultValue="Amman" className="bg-background h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" required placeholder="+962 7..." className="bg-background h-12" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><CreditCard className="h-5 w-5" /></div>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                  <span className="font-medium">Cash on Delivery (COD)</span>
                  <CheckCircle2 className="text-primary h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground mt-4 ml-1">Pay with cash when your order arrives.</p>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm sticky top-28">
              <h3 className="text-xl font-bold font-display mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-secondary rounded-xl p-1 flex-shrink-0">
                       <img src={item.product.imageUrl || ''} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground text-primary">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-semibold text-sm">
                      {formatJOD(Number(item.product.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatJOD(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping (Flat Rate)</span>
                  <span>{formatJOD(SHIPPING_COST)}</span>
                </div>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-2xl mb-8 border border-border/50">
                <div className="flex justify-between items-end">
                  <span className="font-semibold">Total to pay</span>
                  <span className="font-display font-extrabold text-2xl text-primary">{formatJOD(total)}</span>
                </div>
              </div>
              
              <Button 
                type="submit"
                form="checkout-form"
                disabled={isPending || !user}
                size="lg" 
                className="w-full h-14 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                {isPending ? "Processing..." : (user ? "Place Order" : "Login to Place Order")}
              </Button>
              
              <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground gap-2">
                <ShieldCheck className="h-4 w-4" /> Secure checkout powered by Ayoub.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
