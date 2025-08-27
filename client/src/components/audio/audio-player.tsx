import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  title: string;
  description?: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  episodeNumber?: number;
  publishDate?: string;
}

export function AudioPlayer({
  title,
  description,
  audioUrl,
  thumbnailUrl,
  duration,
  episodeNumber,
  publishDate
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setTotalDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        {thumbnailUrl && (
          <div className="md:w-48 h-48 md:h-auto bg-muted flex-shrink-0">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 p-6">
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                {episodeNumber && (
                  <span className="text-sm text-muted-foreground mb-1 block">
                    Episode {episodeNumber}
                  </span>
                )}
                <h3 className="text-lg font-semibold line-clamp-2" data-testid={`text-title-episode-${episodeNumber}`}>
                  {title}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  data-testid={`button-share-episode-${episodeNumber}`}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  data-testid={`button-download-episode-${episodeNumber}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {description}
              </p>
            )}
            
            {publishDate && (
              <p className="text-xs text-muted-foreground">
                Published {publishDate}
              </p>
            )}
          </div>

          {/* Audio Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="default"
                className="h-10 w-10 rounded-full"
                onClick={togglePlayPause}
                data-testid={`button-play-episode-${episodeNumber}`}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              
              <div className="flex-1 space-y-1">
                <Slider
                  value={[currentTime]}
                  max={totalDuration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                  data-testid={`slider-seek-episode-${episodeNumber}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                  data-testid={`slider-volume-episode-${episodeNumber}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </Card>
  );
}

export function AudioPlayerSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 h-48 md:h-auto bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 p-6">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
            <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
            <div className="h-10 bg-muted rounded animate-pulse w-full mt-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}