import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
  placeholder?: React.ReactNode;
}

export function LazySection({
  children,
  className,
  rootMargin = '100px',
  threshold = 0.01,
  minHeight = '200px',
  placeholder
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return (
    <div
      ref={sectionRef}
      className={cn(className)}
      style={{ minHeight: isVisible ? 'auto' : minHeight }}
    >
      {isVisible ? children : (placeholder || (
        <div className="animate-pulse bg-muted rounded-lg" style={{ minHeight }} />
      ))}
    </div>
  );
}