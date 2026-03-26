"use client";
import { useState, useEffect } from 'react';

export default function Toast({ message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`al-toast ${visible ? 'show' : ''}`}>
      <span>✅ {message}</span>
      <button onClick={() => { setVisible(false); onClose(); }}>✕</button>
    </div>
  );
}
