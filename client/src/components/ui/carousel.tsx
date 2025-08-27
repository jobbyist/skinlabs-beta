import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode;
  itemWidth?: string;
  gap?: string;
  showArrows?: boolean;
  autoScroll?: boolean;
  className?: string;
}

export function Carousel({ 
  children, 
  itemWidth = "320px", 
  gap = "16px", 
  showArrows = true,
  autoScroll = false,
  className = ""
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = parseFloat(itemWidth) + parseFloat(gap);
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
        onScroll={checkScrollability}
        style={{ gap }}
      >
        {children}
      </div>
      
      {showArrows && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg transition-opacity ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background'
            }`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            data-testid="carousel-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg transition-opacity ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background'
            }`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            data-testid="carousel-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

// Individual carousel item wrapper
export function CarouselItem({ 
  children, 
  width = "320px",
  className = ""
}: { 
  children: React.ReactNode; 
  width?: string;
  className?: string;
}) {
  return (
    <div 
      className={`flex-none ${className}`}
      style={{ width }}
    >
      {children}
    </div>
  );
}