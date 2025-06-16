'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    categories: 'Categories',
    search: 'Search',
    
    // Categories
    politics: 'Politics',
    technology: 'Technology',
    world: 'World',
    business: 'Business',
    sports: 'Sports',
    entertainment: 'Entertainment',
    
    // Common
    readMore: 'Read More',
    readingTime: 'min read',
    publishedOn: 'Published on',
    by: 'By',
    latest: 'Latest',
    trending: 'Trending',
    newsletter: 'Newsletter',
    subscribe: 'Subscribe',
    email: 'Email',
    
    // Homepage
    heroTitle: 'Stay Informed with HasniTube',
    heroSubtitle: 'Your trusted source for breaking news, in-depth analysis, and comprehensive coverage from around the world.',
    latestNews: 'Latest News',
    trendingNews: 'Trending News',
    
    // Footer
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    
    // Newsletter
    newsletterTitle: 'Stay Updated',
    newsletterDescription: 'Subscribe to our newsletter for the latest news and updates.',
    subscribeButton: 'Subscribe Now',
    emailPlaceholder: 'Enter your email address',
    
    // Search
    searchPlaceholder: 'Search articles...',
    searchResults: 'Search Results',
    noResults: 'No articles found matching your search.',
  },
  ur: {
    // Navigation
    home: 'ہوم',
    categories: 'کیٹگریز',
    search: 'تلاش',
    
    // Categories
    politics: 'سیاست',
    technology: 'ٹیکنالوجی',
    world: 'دنیا',
    business: 'کاروبار',
    sports: 'کھیل',
    entertainment: 'تفریح',
    
    // Common
    readMore: 'مزید پڑھیں',
    readingTime: 'منٹ پڑھیں',
    publishedOn: 'شائع ہوا',
    by: 'بذریعہ',
    latest: 'تازہ ترین',
    trending: 'رجحان',
    newsletter: 'نیوز لیٹر',
    subscribe: 'سبسکرائب',
    email: 'ای میل',
    
    // Homepage
    heroTitle: 'HasniTube کے ساتھ باخبر رہیں',
    heroSubtitle: 'دنیا بھر سے تازہ خبریں، تجزیے اور جامع کوریج کے لیے آپ کا قابل اعتماد ذریعہ۔',
    latestNews: 'تازہ ترین خبریں',
    trendingNews: 'مقبول خبریں',
    
    // Footer
    aboutUs: 'ہمارے بارے میں',
    contactUs: 'ہم سے رابطہ',
    privacyPolicy: 'رازداری کی پالیسی',
    termsOfService: 'خدمات کی شرائط',
    
    // Newsletter
    newsletterTitle: 'اپ ڈیٹ رہیں',
    newsletterDescription: 'تازہ ترین خبروں اور اپ ڈیٹس کے لیے ہمارے نیوز لیٹر کو سبسکرائب کریں۔',
    subscribeButton: 'ابھی سبسکرائب کریں',
    emailPlaceholder: 'اپنا ای میل ایڈریس درج کریں',
    
    // Search
    searchPlaceholder: 'مضامین تلاش کریں...',
    searchResults: 'تلاش کے نتائج',
    noResults: 'آپ کی تلاش سے میل کھاتا کوئی مضمون نہیں ملا۔',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ur')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ur';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}