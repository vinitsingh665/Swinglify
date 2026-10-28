"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function VisitorTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const intervalRef = useRef(null);
  const lastPingRef = useRef(0);

  useEffect(() => {
    // Generate or reuse session ID for this browser session
    let sid = '';
    try {
      sid = sessionStorage.getItem('swinglify_sid');
      if (!sid) {
        const array = new Uint8Array(8);
        window.crypto.getRandomValues(array);
        sid = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        sessionStorage.setItem('swinglify_sid', sid);
      }
    } catch (e) {
      sid = 'anon_' + Math.random().toString(36).substring(2, 10);
    }

    const pingHeartbeat = async (force = false) => {
      // Do not ping when the tab is hidden – saves resources and accurately detects idle/offline
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      const now = Date.now();
      // Throttle route changes: require at least 25s between pings unless forced
      if (!force && now - lastPingRef.current < 25000) {
        return;
      }
      lastPingRef.current = now;

      const activeSid = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('swinglify_sid')) || sid;
      if (!activeSid) return;

      const payload = {
        sessionId: activeSid,
        path: typeof window !== 'undefined' ? window.location.pathname : (pathname || '/'),
        userId: session?.user?.dbId || session?.user?.id || null,
        userEmail: session?.user?.email || null,
      };

      try {
        await fetch('/api/analytics/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
      } catch (err) {
        // Silently catch background drops
      }
    };

    const startInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Increased from 25s to 60s to reduce serverless function invocations & CPU usage by 60%+
      intervalRef.current = setInterval(() => pingHeartbeat(true), 60000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to tab – ping immediately and restart polling
        pingHeartbeat(true);
        startInterval();
      } else {
        // Tab hidden – pause interval to prevent wasted background compute
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    // Ping on mount or session change (throttled on route changes)
    pingHeartbeat(false);
    startInterval();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pathname, session]);

  return null;
}
