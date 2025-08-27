import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setShowOfflineAlert(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineAlert) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Alert variant="destructive" className="border-orange-200 bg-orange-50/95 backdrop-blur-sm dark:border-orange-800 dark:bg-orange-900/95">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="text-sm">
          You're offline. Some features may not work until you reconnect.
        </AlertDescription>
      </Alert>
    </div>
  );
}