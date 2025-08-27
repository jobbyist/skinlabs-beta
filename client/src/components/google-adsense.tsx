import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export default function GoogleAdSense({ 
  adSlot, 
  adFormat = "auto", 
  style = { display: "block" },
  className = "",
  responsive = true 
}: GoogleAdSenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with actual publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
      ></ins>
    </div>
  );
}

// Banner Ad Component for Header/Footer
export function BannerAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAdSense
      adSlot="1234567890" // Replace with actual ad slot
      adFormat="horizontal"
      className={`text-center my-4 ${className}`}
      style={{ 
        display: "block", 
        minHeight: "90px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "4px",
        padding: "20px"
      }}
    />
  );
}

// In-Article Ad Component
export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAdSense
      adSlot="9876543210" // Replace with actual ad slot
      adFormat="fluid"
      className={`my-6 ${className}`}
      style={{ 
        display: "block", 
        minHeight: "250px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "4px",
        padding: "20px"
      }}
    />
  );
}

// Web Stories Ad Component
export function WebStoriesAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAdSense
      adSlot="5432167890" // Replace with actual ad slot
      adFormat="rectangle"
      className={`flex items-center justify-center ${className}`}
      style={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        minHeight: "300px",
        backgroundColor: "#000",
        color: "#fff",
        borderRadius: "8px"
      }}
    />
  );
}

// AdSense Script Loader Component
export function AdSenseScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.querySelector(`script[src*="adsbygoogle"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}