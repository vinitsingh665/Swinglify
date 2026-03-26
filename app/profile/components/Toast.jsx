"use client";
import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Wait 4 seconds then auto-close
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="al-toast">
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
      </svg>
      <span className="al-toast-text">{message}</span>
    </div>
  );
}
