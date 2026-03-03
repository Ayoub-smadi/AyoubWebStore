import { Link } from "wouter";
import { ArrowRight, Star, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { formatJOD } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();
  const { data: products, isLoading } = useProducts();
  const featured = products?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-32 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border text-sm font-medium mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span>{t('home.hero_title')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 text-balance mx-auto max-w-4xl animate-in slide-in-from-bottom-6 duration-700">
            {t('home.hero_subtitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-700 delay-100">
            Curated collections delivered straight to your door with flat-rate shipping across Jordan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                {t('home.shop_now')} <ArrowRight className="ml-2 h-5 w-5 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Flat rate JOD 5.00 shipping nationwide" },
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Your data is encrypted and safe" },
              { icon: Star, title: "Premium Quality", desc: "Handpicked items for the best experience" }
            ].map((f, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border/50 text-center hover-elevate">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Additions</h2>
            <p className="text-muted-foreground">Our newest and most popular items.</p>
          </div>
          <Link href="/products" className="hidden md:flex text-primary font-medium hover:underline items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group cursor-pointer bg-card rounded-2xl border border-border/50 overflow-hidden hover-elevate h-full flex flex-col">
                  <div className="aspect-square bg-secondary relative overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop' }}
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" 
                        alt="Placeholder"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-50 grayscale"
                      />
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2">{product.description}</p>
                    <div className="font-display font-bold text-lg text-primary">
                      {formatJOD(product.price)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/products">
            <Button variant="outline" className="rounded-full">
              View All Products
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Ayoub Web Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
