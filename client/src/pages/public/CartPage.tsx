import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { formatJOD } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const [, setLocation] = useLocation();

  const total = getTotal();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <h1 className="text-4xl font-display font-bold mb-10">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-border border-dashed">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6 opacity-20" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8 h-12">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-3xl border border-border/50 shadow-sm items-center sm:items-start animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-32 h-32 bg-secondary rounded-2xl overflow-hidden flex-shrink-0 p-2">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center"><ShoppingBag className="text-muted-foreground opacity-50" /></div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">{item.product.name}</h3>
                      </Link>
                      <div className="font-display font-bold text-lg whitespace-nowrap ml-4">
                        {formatJOD(Number(item.product.price) * item.quantity)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{formatJOD(item.product.price)} each</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 bg-secondary rounded-full p-1 border border-border/50">
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background"
                          onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm sticky top-28">
                <h3 className="text-xl font-bold font-display mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatJOD(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-between items-end mb-8">
                  <span className="font-semibold text-lg">Estimated Total</span>
                  <span className="font-display font-extrabold text-2xl text-primary">{formatJOD(total)}</span>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                  onClick={() => setLocation('/checkout')}
                >
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
