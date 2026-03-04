import { useState } from "react";
import { useParams, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { formatJOD } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

export function ProductDetailsPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(Number(id));
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('products.not_found')}</h2>
          <p className="text-muted-foreground mb-8">{t('products.not_found_desc')}</p>
          <Link href="/products">
            <Button size="lg" className="rounded-full"><ArrowLeft className="mr-2 h-4 w-4" /> {t('products.back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    const productName = i18n.language === 'ar' && product.nameAr ? product.nameAr : product.name;
    toast({
      title: t('products.added'),
      description: `${quantity}x ${productName} ${t('products.added')}`,
      action: (
        <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
      )
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" /> {t('products.back')}
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image Gallery area */}
          <div className="bg-secondary/50 rounded-[2rem] aspect-square p-8 flex items-center justify-center border border-border/50 relative">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal animate-in fade-in zoom-in duration-700"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop' }}
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop" 
                alt="Placeholder"
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-50 animate-in fade-in zoom-in duration-700"
              />
            )}
            
            {product.category && (
              <div className="absolute top-8 left-8 bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-border font-medium text-sm shadow-sm rtl:left-auto rtl:right-8">
                {t(`categories.${product.category}`, product.category)}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col pt-4 lg:pt-8 animate-in slide-in-from-right-8 duration-700 rtl:slide-in-from-left-8">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight mb-4 text-balance">
              {i18n.language === 'ar' && product.nameAr ? product.nameAr : product.name}
            </h1>
            
            <div className="text-3xl font-display font-extrabold text-primary mb-8">
              {formatJOD(product.price)}
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 text-muted-foreground text-lg leading-relaxed">
              <p>
                {i18n.language === 'ar' && product.descriptionAr 
                  ? product.descriptionAr 
                  : (product.description || "No description provided for this premium item.")}
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold">{t('products.quantity')}</span>
                <div className="flex items-center gap-4 bg-secondary rounded-full p-1 border border-border/50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full hover:bg-background hover:shadow-sm transition-all"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-display font-bold w-6 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full hover:bg-background hover:shadow-sm transition-all"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('products.availability')}</span>
                <span className={`font-semibold ${product.stock > 0 ? "text-green-500" : "text-destructive"}`}>
                  {product.stock > 0 ? t('products.in_stock', { count: product.stock }) : t('products.out_of_stock')}
                </span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="h-16 text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-3 h-5 w-5 rtl:ml-3 rtl:mr-0" />
              {product.stock === 0 ? t('products.out_of_stock') : t('products.add_to_cart')}
            </Button>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {t('products.secure_payment')}</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {t('products.free_returns')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
