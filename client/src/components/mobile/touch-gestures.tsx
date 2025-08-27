import { useState, useEffect, useRef, ReactNode } from "react";

interface TouchGesturesProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  className?: string;
  threshold?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export default function TouchGestures({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  className = "",
  threshold = 50
}: TouchGesturesProps) {
  const [startTouch, setStartTouch] = useState<TouchPoint | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartTouch({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startTouch) return;

    const touch = e.changedTouches[0];
    const endTouch = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = endTouch.x - startTouch.x;
    const deltaY = endTouch.y - startTouch.y;
    const deltaTime = endTouch.time - startTouch.time;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Check for swipe gestures
    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    } else if (deltaTime < 300 && absX < 10 && absY < 10) {
      // Tap gesture
      const now = Date.now();
      const timeDiff = now - lastTap;

      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap
        if (onDoubleTap) {
          onDoubleTap();
        }
        setLastTap(0);
      } else {
        // Single tap
        if (onTap) {
          setTimeout(() => {
            if (Date.now() - now >= 250) {
              onTap();
            }
          }, 250);
        }
        setLastTap(now);
      }
    }

    setStartTouch(null);
  };

  return (
    <div
      ref={elementRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling
    >
      {children}
    </div>
  );
}