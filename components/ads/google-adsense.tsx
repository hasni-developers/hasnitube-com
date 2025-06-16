'use client';

import React, { useEffect } from 'react';

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function GoogleAdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = { display: 'block' }
}: GoogleAdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}

// Predefined ad components for common placements
export function HeaderAd() {
  return (
    <div className="w-full flex justify-center py-4 border-y border-border/50">
      <GoogleAdSense
        adSlot="1234567890"
        adFormat="horizontal"
        className="max-w-4xl"
        style={{ display: 'block', width: '100%', height: '90px' }}
      />
    </div>
  );
}

export function SidebarAd() {
  return (
    <div className="sticky top-4">
      <GoogleAdSense
        adSlot="0987654321"
        adFormat="rectangle"
        className="w-full"
        style={{ display: 'block', width: '300px', height: '250px' }}
      />
    </div>
  );
}

export function InArticleAd() {
  return (
    <div className="my-8 flex justify-center">
      <GoogleAdSense
        adSlot="1122334455"
        adFormat="rectangle"
        style={{ display: 'block', width: '336px', height: '280px' }}
      />
    </div>
  );
}

export function FooterAd() {
  return (
    <div className="w-full flex justify-center py-6">
      <GoogleAdSense
        adSlot="5544332211"
        adFormat="horizontal"
        className="max-w-4xl"
        style={{ display: 'block', width: '100%', height: '90px' }}
      />
    </div>
  );
}