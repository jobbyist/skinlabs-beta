import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSenseBlockProps {
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  slot: string;
  responsive?: boolean;
  testMode?: boolean;
  style?: React.CSSProperties;
}

export function AdSenseBlock({
  className,
  format = "auto",
  slot,
  responsive = true,
  testMode = false,
  style = {}
}: AdSenseBlockProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Push ad to adsbygoogle array
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div 
      ref={adRef}
      className={cn("adsense-container w-full my-6", className)}
      data-testid={`adsense-block-${slot}`}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "90px",
          ...style
        }}
        data-ad-client="ca-pub-1237323355260727"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        data-ad-test={testMode ? "on" : undefined}
      />
    </div>
  );
}

// Different ad types for various placements
export function InArticleAd({ className }: { className?: string }) {
  return (
    <AdSenseBlock
      slot="1234567890" // Replace with actual ad slot ID
      format="fluid"
      className={cn("my-8 px-4", className)}
      style={{ textAlign: "center" }}
    />
  );
}

export function DisplayAd({ className }: { className?: string }) {
  return (
    <AdSenseBlock
      slot="2345678901" // Replace with actual ad slot ID
      format="auto"
      className={cn("my-6", className)}
    />
  );
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <AdSenseBlock
      slot="3456789012" // Replace with actual ad slot ID
      format="vertical"
      className={cn("sticky top-20", className)}
      style={{ minHeight: "250px" }}
    />
  );
}

export function BannerAd({ className }: { className?: string }) {
  return (
    <AdSenseBlock
      slot="4567890123" // Replace with actual ad slot ID
      format="horizontal"
      className={cn("my-4", className)}
      style={{ maxHeight: "90px" }}
    />
  );
}