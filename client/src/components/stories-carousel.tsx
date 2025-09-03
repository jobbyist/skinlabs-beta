import React, { useEffect, useRef, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  views?: string;
  category?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface StoriesCarouselProps {
  stories: Story[];
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export function StoriesCarousel({
  stories,
  className,
  autoplay = true,
  autoplayInterval = 5000
}: StoriesCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Determine slides per view based on viewport
  const getSlidesPerView = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 1024) return 2;
    if (width <= 1439) return 3;
    return 4;
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  // Update slides per view on resize
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: stories.length > slidesPerView,
    mode: "snap",
    slides: {
      perView: slidesPerView,
      spacing: 16,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    detailsChanged(s) {
      // Update when slider details change
      if (s.track.details) {
        setCurrentSlide(s.track.details.rel);
      }
    }
  });

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || !loaded || isPaused || stories.length <= slidesPerView) return;

    const startAutoplay = () => {
      autoplayRef.current = setTimeout(() => {
        if (instanceRef.current) {
          instanceRef.current.next();
        }
      }, autoplayInterval);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [autoplay, autoplayInterval, currentSlide, loaded, isPaused, slidesPerView, stories.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!instanceRef.current) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      instanceRef.current.prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      instanceRef.current.next();
    }
  };

  const handlePausePlay = () => {
    setIsPaused(!isPaused);
  };

  const showControls = stories.length > slidesPerView;

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing slide {currentSlide + 1} of {stories.length}
      </div>

      {/* Carousel container */}
      <div
        ref={sliderRef}
        className="keen-slider"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured Stories"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {stories.map((story, idx) => (
          <div
            key={story.id}
            className="keen-slider__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${stories.length}`}
          >
            <Link href={story.ctaLink || '#'}>
              <a 
                className="block relative overflow-hidden rounded-xl group/card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={story.title}
              >
                {/* Card with 3:4 aspect ratio */}
                <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {story.category && (
                      <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded">
                        {story.category}
                      </span>
                    )}
                    
                    <h3 className="text-lg font-bold mb-1 line-clamp-2 drop-shadow-lg">
                      {story.title}
                    </h3>
                    
                    {story.subtitle && (
                      <p className="text-sm opacity-90 line-clamp-1 drop-shadow-md">
                        {story.subtitle}
                      </p>
                    )}
                    
                    {story.views && (
                      <p className="text-xs opacity-75 mt-2">
                        {story.views} views
                      </p>
                    )}
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      {showControls && loaded && (
        <>
          {/* Previous button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/90 dark:hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity min-w-[44px] min-h-[44px]"
            onClick={(e) => {
              e.preventDefault();
              instanceRef.current?.prev();
            }}
            aria-label="Previous slide"
            data-testid="carousel-prev"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Next button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/90 dark:hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity min-w-[44px] min-h-[44px]"
            onClick={(e) => {
              e.preventDefault();
              instanceRef.current?.next();
            }}
            aria-label="Next slide"
            data-testid="carousel-next"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Autoplay control */}
          {autoplay && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 bottom-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/90 dark:hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity min-w-[44px] min-h-[44px]"
              onClick={(e) => {
                e.preventDefault();
                handlePausePlay();
              }}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              data-testid="carousel-autoplay"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          )}
        </>
      )}

      {/* Dots indicator */}
      {showControls && loaded && (
        <div className="flex justify-center gap-1 mt-4" role="tablist">
          {Array.from({ length: Math.ceil(stories.length / slidesPerView) }).map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                Math.floor(currentSlide / slidesPerView) === idx 
                  ? "bg-primary w-6" 
                  : "bg-gray-300 dark:bg-gray-600"
              )}
              onClick={() => {
                instanceRef.current?.moveToIdx(idx * slidesPerView);
              }}
              aria-label={`Go to slide group ${idx + 1}`}
              aria-selected={Math.floor(currentSlide / slidesPerView) === idx}
              role="tab"
              data-testid={`carousel-dot-${idx}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}