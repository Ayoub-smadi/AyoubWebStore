import { useState } from "react";
import { Link } from "wouter";
import { Search, Filter, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { formatJOD } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { useTranslation } from 'react-i18next';

export function ProductsPage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const { data: products, isLoading } = useProducts(search, category);

  // Extract unique categories from products
  const { data: allProducts } = useProducts();
  const categories = Array.from(new Set((allProducts || []).map(p => p.category).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{t('products.title')}</h1>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input 
                placeholder={t('products.search')} 
                className="pl-10 rtl:pl-3 rtl:pr-10 h-12 rounded-xl bg-card border-border focus-visible:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <Button 
                variant={!category ? "default" : "outline"} 
                className="rounded-full whitespace-nowrap"
                onClick={() => setCategory(undefined)}
              >
                {t('products.all')}
              </Button>
              {categories.map(c => (
                <Button 
                  key={c}
                  variant={category === c ? "default" : "outline"} 
                  className="rounded-full whitespace-nowrap"
                  onClick={() => setCategory(c)}
                >
                  {t(`categories.${c}`, c)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-72 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-border border-dashed">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">{t('products.empty')}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('products.empty_desc')}
            </p>
            <Button variant="outline" className="mt-8" onClick={() => { setSearch(""); setCategory(undefined); }}>
              {t('products.clear')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group cursor-pointer bg-card rounded-3xl border border-border/50 overflow-hidden hover-elevate h-full flex flex-col shadow-sm">
                  <div className="aspect-[4/5] bg-secondary relative overflow-hidden p-6 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop' }}
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop" 
                        alt="Placeholder"
                        className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal opacity-50 group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    )}
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2 rtl:left-auto rtl:right-4">
                      {product.category && (
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-md hover:bg-background/90 text-xs">
                          {t(`categories.${product.category}`, product.category)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 text-foreground">
                      {i18n.language === 'ar' && product.nameAr ? product.nameAr : product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <span className="font-display font-bold text-xl text-primary">
                        {formatJOD(product.price)}
                      </span>
                      {product.stock === 0 ? (
                        <span className="text-xs font-semibold text-destructive uppercase tracking-wider">{t('products.out_of_stock')}</span>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
