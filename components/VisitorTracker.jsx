"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // We do not want to track admins as generic visitors
    if (pathname && pathname.startsWith('/vinit_admin')) {
      return;
    }

    // Assign a temporary session ID for this browser tab
    if (!sessionStorage.getItem('swinglify_sid')) {
      const array = new Uint8Array(8);
      window.crypto.getRandomValues(array);
      const sid = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem('swinglify_sid', sid);
    }
    
    const trackHeartbeat = () => {
      const sid = sessionStorage.getItem('swinglify_sid');
      if (sid) {
        fetch('/api/analytics/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid, path: window.location.pathname }),
          keepalive: true
        }).catch(() => {});
      }
    };

    // Fire immediately and set a 15-second heartbeat
    trackHeartbeat();
    const interval = setInterval(trackHeartbeat, 15000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null; // Invisible component
}
