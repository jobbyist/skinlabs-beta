import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Volume2, Download, Share2, 
  ThumbsUp, ThumbsDown, DollarSign, Eye, Copy, Check 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import PayPalTipButton from "@/components/PayPalTipButton";

interface AudioPlayerProps {
  title: string;
  description?: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  episodeNumber?: number;
  publishDate?: string;
  playCount?: number;
  likes?: number;
  dislikes?: number;
}

export function AudioPlayer({
  title,
  description,
  audioUrl,
  thumbnailUrl,
  duration,
  episodeNumber,
  publishDate,
  playCount = 0,
  likes = 0,
  dislikes = 0
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [userFeedback, setUserFeedback] = useState<'like' | 'dislike' | null>(null);
  const [localPlayCount, setLocalPlayCount] = useState(playCount);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localDislikes, setLocalDislikes] = useState(dislikes);
  const [copied, setCopied] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasPlayed = useRef(false);
  const { toast } = useToast();

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
      // Track play count on first play
      if (!hasPlayed.current) {
        hasPlayed.current = true;
        setLocalPlayCount(prev => prev + 1);
      }
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

  const handleLike = () => {
    if (userFeedback === 'like') {
      setUserFeedback(null);
      setLocalLikes(prev => prev - 1);
    } else {
      if (userFeedback === 'dislike') {
        setLocalDislikes(prev => prev - 1);
      }
      setUserFeedback('like');
      setLocalLikes(prev => prev + 1);
    }
  };

  const handleDislike = () => {
    if (userFeedback === 'dislike') {
      setUserFeedback(null);
      setLocalDislikes(prev => prev - 1);
    } else {
      if (userFeedback === 'like') {
        setLocalLikes(prev => prev - 1);
      }
      setUserFeedback('dislike');
      setLocalDislikes(prev => prev + 1);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) {
      toast({
        title: "Download unavailable",
        description: "This episode is not available for download yet.",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your episode is being downloaded.",
    });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/streams#episode-${episodeNumber}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Episode link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Could not copy link",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTip = () => {
    setShowTipModal(true);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        {thumbnailUrl && (
          <div className="md:w-64 lg:w-80 h-48 md:h-auto bg-muted flex-shrink-0">
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
            </div>
            
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {publishDate && <span>Published {publishDate}</span>}
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{localPlayCount.toLocaleString()} plays</span>
              </div>
            </div>
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
            
            {/* Community Feedback & Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {/* Like Button */}
                <Button
                  size="sm"
                  variant={userFeedback === 'like' ? "default" : "outline"}
                  className="h-8 gap-1"
                  onClick={handleLike}
                  data-testid={`button-like-episode-${episodeNumber}`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs">{localLikes}</span>
                </Button>
                
                {/* Dislike Button */}
                <Button
                  size="sm"
                  variant={userFeedback === 'dislike' ? "default" : "outline"}
                  className="h-8 gap-1"
                  onClick={handleDislike}
                  data-testid={`button-dislike-episode-${episodeNumber}`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="text-xs">{localDislikes}</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Tip Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 text-green-600 hover:text-green-700"
                  onClick={handleTip}
                  data-testid={`button-tip-episode-${episodeNumber}`}
                >
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Tip $1+</span>
                </Button>
                
                {/* Download Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={handleDownload}
                  data-testid={`button-download-episode-${episodeNumber}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                {/* Share Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={handleShare}
                  data-testid={`button-share-episode-${episodeNumber}`}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* PayPal Tip Modal */}
      <PayPalTipButton
        episodeId={episodeNumber?.toString() || title}
        episodeTitle={title}
        open={showTipModal}
        onOpenChange={setShowTipModal}
      />
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