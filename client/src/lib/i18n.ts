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
        "shop_now": "Shop Collection"
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
        "shop_now": "تسوق الآن"
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