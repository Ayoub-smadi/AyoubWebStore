import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "shop": "Shop",
        "profile": "Profile",
        "admin": "Admin Dashboard",
        "logout": "Log out",
        "signin": "Sign In"
      },
      "home": {
        "hero_title": "Premium Quality E-Commerce",
        "hero_subtitle": "Discover Exceptional Products for Your Lifestyle",
        "hero_desc": "Curated collections delivered straight to your door with flat-rate shipping across Jordan.",
        "shop_now": "Shop Collection",
        "features": {
          "delivery": "Fast Delivery",
          "delivery_desc": "Flat rate JOD 5.00 shipping nationwide",
          "secure": "Secure Checkout",
          "secure_desc": "Your data is encrypted and safe",
          "quality": "Premium Quality",
          "quality_desc": "Handpicked items for the best experience"
        },
        "featured": "Featured Additions",
        "featured_desc": "Our newest and most popular items.",
        "view_all": "View All",
        "copyright": "© {{year}} Ayoub Web Store. All rights reserved."
      },
      "products": {
        "title": "Our Collection",
        "search": "Search products...",
        "all": "All",
        "empty": "No products found",
        "empty_desc": "We couldn't find anything matching your current filters. Try a different search term or category.",
        "clear": "Clear Filters",
        "out_of_stock": "Out of Stock",
        "add_to_cart": "Add to Cart",
        "added": "Added to Cart"
      },
      "cart": {
        "title": "Shopping Cart",
        "empty": "Your cart is empty",
        "empty_desc": "Looks like you haven't added anything to your cart yet.",
        "start_shopping": "Start Shopping",
        "remove": "Remove",
        "summary": "Order Summary",
        "subtotal": "Subtotal",
        "shipping": "Shipping",
        "shipping_calc": "Calculated at checkout",
        "total": "Estimated Total",
        "checkout": "Proceed to Checkout"
      },
      "checkout": {
        "title": "Checkout",
        "shipping_info": "Shipping Information",
        "first_name": "First Name",
        "last_name": "Last Name",
        "address": "Full Address",
        "address_placeholder": "Street, Building, Apartment",
        "city": "City / Governorate",
        "city_placeholder": "Amman",
        "phone": "Phone Number",
        "payment": "Payment Method",
        "cod": "Cash on Delivery (COD)",
        "cod_desc": "Pay with cash when your order arrives.",
        "order_summary": "Order Summary",
        "qty": "Qty",
        "shipping_flat": "Shipping (Flat Rate)",
        "total_pay": "Total to pay",
        "processing": "Processing...",
        "place_order": "Place Order",
        "login_to_order": "Login to Place Order",
        "secure": "Secure checkout powered by Ayoub.",
        "login_required": "Login required",
        "success": "Order Confirmed!",
        "failed": "Checkout Failed"
      },
      "common": {
        "jod": "JOD"
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "home": "الرئيسية",
        "shop": "المتجر",
        "profile": "الملف الشخصي",
        "admin": "لوحة التحكم",
        "logout": "تسجيل الخروج",
        "signin": "تسجيل الدخول"
      },
      "home": {
        "hero_title": "متجر إلكتروني عالي الجودة",
        "hero_subtitle": "اكتشف منتجات استثنائية لنمط حياتك",
        "hero_desc": "مجموعات مختارة بعناية تصلك لباب بيتك مع شحن ثابت لجميع أنحاء الأردن.",
        "shop_now": "تسوق الآن",
        "features": {
          "delivery": "توصيل سريع",
          "delivery_desc": "سعر شحن ثابت 5.00 دينار لكافة المحافظات",
          "secure": "دفع آمن",
          "secure_desc": "بياناتك مشفرة ومحمية بالكامل",
          "quality": "جودة ممتازة",
          "quality_desc": "منتجات مختارة بعناية لأفضل تجربة"
        },
        "featured": "أحدث الإضافات",
        "featured_desc": "أحدث المنتجات والأكثر مبيعاً لدينا.",
        "view_all": "عرض الكل",
        "copyright": "© {{year}} متجر أيوب. جميع الحقوق محفوظة."
      },
      "products": {
        "title": "مجموعتنا",
        "search": "ابحث عن المنتجات...",
        "all": "الكل",
        "empty": "لم يتم العثور على منتجات",
        "empty_desc": "لم نتمكن من العثور على أي شيء يطابق الفلاتر الحالية. جرب البحث عن كلمة أخرى.",
        "clear": "مسح الفلاتر",
        "out_of_stock": "نفدت الكمية",
        "add_to_cart": "إضافة للسلة",
        "added": "تمت الإضافة"
      },
      "cart": {
        "title": "سلة التسوق",
        "empty": "سلة التسوق فارغة",
        "empty_desc": "يبدو أنك لم تضف أي شيء إلى سلتك بعد.",
        "start_shopping": "ابدأ التسوق",
        "remove": "حذف",
        "summary": "ملخص الطلب",
        "subtotal": "المجموع الفرعي",
        "shipping": "الشحن",
        "shipping_calc": "يُحسب عند الدفع",
        "total": "المجموع التقديري",
        "checkout": "المتابعة لإتمام الطلب"
      },
      "checkout": {
        "title": "إتمام الطلب",
        "shipping_info": "معلومات الشحن",
        "first_name": "الاسم الأول",
        "last_name": "اسم العائلة",
        "address": "العنوان بالكامل",
        "address_placeholder": "الشارع، البناية، رقم الشقة",
        "city": "المدينة / المحافظة",
        "city_placeholder": "عمان",
        "phone": "رقم الهاتف",
        "payment": "طريقة الدفع",
        "cod": "الدفع عند الاستلام",
        "cod_desc": "ادفع نقداً عند وصول طلبك.",
        "order_summary": "ملخص الطلب",
        "qty": "الكمية",
        "shipping_flat": "الشحن (سعر ثابت)",
        "total_pay": "إجمالي المبلغ المطلوب",
        "processing": "جاري المعالجة...",
        "place_order": "تأكيد الطلب",
        "login_to_order": "سجل دخول لتأكيد الطلب",
        "secure": "إتمام طلب آمن مدعوم من أيوب.",
        "login_required": "يجب تسجيل الدخول",
        "success": "تم تأكيد طلبك بنجاح!",
        "failed": "فشل في إتمام الطلب"
      },
      "common": {
        "jod": "د.أ"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;