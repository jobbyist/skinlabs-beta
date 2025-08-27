import { useEffect } from "react";

export default function PWAProvider() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Show update available notification
                  if (window.confirm('A new version is available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        } catch (error) {
          console.log('SW registration failed: ', error);
        }
      });
    }

    // Add PWA meta tags dynamically
    const addMetaTags = () => {
      const head = document.head;
      
      const metaTags = [
        { name: 'theme-color', content: '#10b981' },
        { name: 'background-color', content: '#000000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'SKYNN' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-TileColor', content: '#10b981' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'format-detection', content: 'telephone=no' }
      ];

      const linkTags = [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icon-192x192.png', sizes: '192x192' },
        { rel: 'icon', href: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }
      ];

      metaTags.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          head.appendChild(meta);
        }
      });

      linkTags.forEach(({ rel, href, sizes, type }) => {
        if (!document.querySelector(`link[rel="${rel}"]`)) {
          const link = document.createElement('link');
          link.rel = rel;
          link.href = href;
          if (sizes) link.setAttribute('sizes', sizes);
          if (type) link.type = type;
          head.appendChild(link);
        }
      });
    };

    addMetaTags();

    // Handle app install banner
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Expose install method globally for components
    (window as any).installPWA = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        return outcome === 'accepted';
      }
      return false;
    };

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}