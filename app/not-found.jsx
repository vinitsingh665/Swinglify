"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import './not-found.css'; // Import standard CSS file to avoid FOUC

export default function NotFound() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glitchText, setGlitchText] = useState('404');
// ... [rest of the component state/effects remain exactly identical] ...

  // Glitch text effect
  useEffect(() => {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';
    const interval = setInterval(() => {
      const shouldGlitch = Math.random() > 0.7;
      if (shouldGlitch) {
        const glitched = '404'.split('').map(c =>
          Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : c
        ).join('');
        setGlitchText(glitched);
        setTimeout(() => setGlitchText('404'), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Floating particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Parallax mouse tracking
  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 30,
      y: (e.clientY / window.innerHeight - 0.5) * 30,
    });
  };

  return (
    <div className="nf-page" onMouseMove={handleMouseMove}>
      <canvas ref={canvasRef} className="nf-canvas" />

      {/* Gradient orbs */}
      <div className="nf-orb nf-orb-1" />
      <div className="nf-orb nf-orb-2" />
      <div className="nf-orb nf-orb-3" />

      <div className="nf-content" style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}>
        {/* Glitching 404 */}
        <div className="nf-code-wrap">
          <span className="nf-code" data-text={glitchText}>{glitchText}</span>
          <div className="nf-scanline" />
        </div>

        <h1 className="nf-title">Lost in the void</h1>
        <p className="nf-subtitle">
          The page you're looking for has been swallowed by the market. <br />
          Maybe it was a bear trap all along.
        </p>

        <div className="nf-actions">
          <Link href="/" className="nf-btn nf-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
            </svg>
            Go Home
          </Link>
          <Link href="/markets" className="nf-btn nf-btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            View Markets
          </Link>
        </div>

        {/* Fun ticker tape */}
        <div className="nf-ticker">
          <div className="nf-ticker-track">
            <span>PAGE_NOT_FOUND ▼ 100%</span>
            <span>HOPE ▲ 99.9%</span>
            <span>LOST_URL ▼ 404%</span>
            <span>REDIRECT ▲ PENDING</span>
            <span>PAGE_NOT_FOUND ▼ 100%</span>
            <span>HOPE ▲ 99.9%</span>
            <span>LOST_URL ▼ 404%</span>
            <span>REDIRECT ▲ PENDING</span>
          </div>
        </div>
      </div>
    </div>
  );
}
