import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { WebStory } from "@shared/schema";
import TouchGestures from "@/components/mobile/touch-gestures";
import { WebStoriesAd } from "@/components/google-adsense";

interface WebStoriesViewerProps {
  stories: WebStory[];
  isOpen: boolean;
  onClose: () => void;
  initialStoryIndex?: number;
}

export default function WebStoriesViewer({ stories, isOpen, onClose, initialStoryIndex = 0 }: WebStoriesViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentStoryIndex];
  const slides = currentStory?.pages || [];
  const currentSlide = slides[currentSlideIndex];
  const slideDuration = 5000; // 5 seconds per slide

  useEffect(() => {
    if (!isOpen || !isPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (slideDuration / 100));
        
        if (newProgress >= 100) {
          handleNextSlide();
          return 0;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, currentSlideIndex, slides.length]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      handleNextStory();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    } else {
      handlePrevStory();
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSlideIndex(0);
      setProgress(0);
    }
  };

  const handleStorySelect = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex);
    setCurrentSlideIndex(0);
    setProgress(0);
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const screenWidth = rect.width;
    
    if (clickX < screenWidth / 3) {
      handlePrevSlide();
    } else if (clickX > (2 * screenWidth) / 3) {
      handleNextSlide();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  if (!isOpen || !currentStory || !currentSlide) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          {/* Progress bars */}
          <div className="flex-1 flex space-x-1 mr-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: index === currentSlideIndex ? `${progress}%` : index < currentSlideIndex ? '100%' : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/20"
              data-testid="button-play-pause"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              data-testid="button-close-stories"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Story info */}
        <div className="mt-4">
          <h2 className="text-white font-semibold" data-testid="text-story-title">
            {currentStory.title}
          </h2>
          <p className="text-white/80 text-sm">
            {currentSlideIndex + 1} of {slides.length}
          </p>
        </div>
      </div>

      {/* Main content area */}
      <TouchGestures
        className="flex-1 relative cursor-pointer"
        onSwipeLeft={handleNextSlide}
        onSwipeRight={handlePrevSlide}
        onTap={() => setIsPlaying(!isPlaying)}
        onDoubleTap={handleNextSlide}
      >
        <div 
          onClick={handleScreenClick}
          data-testid="web-stories-viewer-content"
          className="h-full w-full relative"
        >
        {/* Background image/video */}
        {currentSlide.mediaUrl && (
          <div className="absolute inset-0">
            {currentSlide.mediaType === 'video' ? (
              <video
                src={currentSlide.mediaUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={currentSlide.mediaUrl}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="text-white">
            {currentSlide.title && (
              <h3 className="text-2xl font-bold mb-2" data-testid={`text-slide-title-${currentSlideIndex}`}>
                {currentSlide.title}
              </h3>
            )}
            {currentSlide.content && (
              <p className="text-lg leading-relaxed" data-testid={`text-slide-content-${currentSlideIndex}`}>
                {currentSlide.content}
              </p>
            )}
            {currentSlide.ctaText && currentSlide.ctaUrl && (
              <Button
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(currentSlide.ctaUrl, '_blank');
                }}
                data-testid={`button-cta-${currentSlideIndex}`}
              >
                {currentSlide.ctaText}
              </Button>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevSlide();
          }}
          disabled={currentStoryIndex === 0 && currentSlideIndex === 0}
          data-testid="button-prev-slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            handleNextSlide();
          }}
          data-testid="button-next-slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        </div>
      </TouchGestures>

      {/* Story navigation dots */}
      {stories.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex space-x-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStorySelect(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStoryIndex ? 'bg-white' : 'bg-white/50'
                }`}
                data-testid={`button-story-${index}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}