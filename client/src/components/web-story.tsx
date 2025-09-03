import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Eye, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WebStoryProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  views: number;
  duration?: number;
  category?: string;
  ctaText?: string;
  ctaLink?: string;
  publisher?: string;
  publisherLogo?: string;
  datePublished?: string;
  keywords?: string[];
}

export function WebStory({ 
  id, 
  title, 
  subtitle, 
  image, 
  views, 
  duration = 15, 
  category,
  ctaText = "Learn More",
  ctaLink = "/articles",
  publisher = "SKYNN",
  publisherLogo = "/logo.png",
  datePublished = new Date().toISOString(),
  keywords = ["skincare", "beauty", "tips"]
}: WebStoryProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [localViews, setLocalViews] = useState(views);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + (100 / (duration * 10));
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, progress, duration]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPlaying && progress === 0) {
      setLocalViews(prev => prev + 1);
    }
    setIsPlaying(!isPlaying);
    if (progress >= 100) {
      setProgress(0);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Add structured data for SEO
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": title,
      "image": image,
      "datePublished": datePublished,
      "dateModified": datePublished,
      "author": {
        "@type": "Organization",
        "name": publisher
      },
      "publisher": {
        "@type": "Organization",
        "name": publisher,
        "logo": {
          "@type": "ImageObject",
          "url": publisherLogo
        }
      },
      "description": subtitle,
      "keywords": keywords.join(", ")
    });
    const existingScript = document.querySelector(`script[data-story-id="${id}"]`);
    if (existingScript) {
      existingScript.remove();
    }
    script.setAttribute('data-story-id', id);
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.querySelector(`script[data-story-id="${id}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [id, title, subtitle, image, datePublished, publisher, publisherLogo, keywords]);

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      itemScope 
      itemType="https://schema.org/VideoObject"
    >
      {/* SEO Meta Tags */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={subtitle} />
      <meta itemProp="thumbnailUrl" content={image} />
      <meta itemProp="uploadDate" content={datePublished} />
      <meta itemProp="duration" content={`PT${duration}S`} />
      
      {/* Story Container with Instagram-style aspect ratio */}
      <div className="relative aspect-[9/16] bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-xl">
        {/* Background Image */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        
        {/* Progress Bar (Instagram-style) */}
        <div className="absolute top-0 left-0 right-0 z-20 p-2">
          <div className="w-full h-[2px] bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header Controls */}
        <div className="absolute top-4 left-0 right-0 z-20 px-4 flex items-center justify-between">
          {/* Category Badge */}
          {category && (
            <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-[10px] font-semibold text-white uppercase tracking-wider">
                {category}
              </span>
            </div>
          )}
          
          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/60 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Play/Pause Button (Center) */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-200",
            isHovered || !isPlaying ? "opacity-100" : "opacity-0"
          )}
        >
          <button
            onClick={handlePlayPause}
            className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-colors transform hover:scale-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Google Ad Placement Area (Top) */}
        <div 
          className="absolute top-[15%] left-2 right-2 z-30 pointer-events-none"
          data-ad-slot="story-top"
          data-ad-format="auto"
        >
          {/* Ad space reserved for Google AdSense */}
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          {/* View Counter */}
          <div className="flex items-center gap-1 mb-3">
            <Eye className="w-3 h-3 text-white/80" />
            <span className="text-xs text-white/80 font-medium">
              {formatViews(localViews)} views
            </span>
          </div>
          
          {/* Title and Subtitle */}
          <div className="space-y-1">
            <h3 className="text-white font-bold text-sm line-clamp-2" itemProp="headline">
              {title}
            </h3>
            <p className="text-white/80 text-xs line-clamp-2" itemProp="description">
              {subtitle}
            </p>
          </div>
          
          {/* Call to Action Button */}
          <a 
            href={ctaLink}
            onClick={(e) => e.stopPropagation()}
            className="mt-3 block"
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={ctaText}
          >
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full bg-white/90 hover:bg-white text-black font-semibold backdrop-blur-sm"
            >
              {ctaText}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
          
          {/* Google Ad Placement Area (Bottom) */}
          <div 
            className="mt-2"
            data-ad-slot="story-bottom"
            data-ad-format="rectangle"
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          >
            {/* Ad space reserved for Google AdSense */}
          </div>
        </div>
      </div>
    </div>
  );
}