import { useTranslation } from 'react-i18next';
import { ShoppingBag } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">
                Ayoub<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('footer.description', 'Your premier destination for high-quality products and exceptional service.')}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">{t('footer.shop', 'Shop')}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="/products" className="hover:text-primary transition-colors">{t('footer.all_products', 'All Products')}</a></li>
              <li><a href="/products?category=Electronics" className="hover:text-primary transition-colors">{t('footer.electronics', 'Electronics')}</a></li>
              <li><a href="/products?category=Furniture" className="hover:text-primary transition-colors">{t('footer.furniture', 'Furniture')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t('footer.company', 'Company')}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.about', 'About Us')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.contact', 'Contact')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.shipping', 'Shipping Policy')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t('footer.newsletter', 'Newsletter')}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.newsletter_desc', 'Subscribe to get special offers and once-in-a-lifetime deals.')}
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Ayoub Store. {t('footer.rights', 'All rights reserved.')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">{t('footer.privacy', 'Privacy Policy')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('footer.terms', 'Terms of Service')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
