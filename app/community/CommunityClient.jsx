"use client";

function renderMarkdown(text) {
  if (!text) return '';
  let html = text.replace(/^([^\n]+)\n={3,}\s*$/gm, '<h3 style="margin-top:1em; margin-bottom:0.5em;">$1</h3>');
  html = html.replace(/^([^\n]+)\n-{3,}\s*$/gm, '<h4 style="margin-top:1em; margin-bottom:0.5em;">$1</h4>');
  html = html.replace(/^#### (.*$)/gim, '<h4 style="margin-top:1em; margin-bottom:0.5em;">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 style="margin-top:1em; margin-bottom:0.5em;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="margin-top:1em; margin-bottom:0.5em;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="margin-top:1em; margin-bottom:0.5em;">$1</h1>');
  html = html.replace(/\*\*(.*?\S)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^\*\n]+)\*/g, '<em>$1</em>');
  html = html.replace(/(<\/[hH][1-6]>)\n/g, '$1');
  html = html.replace(/\n/g, '<br />');
  return html;
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { getUserBadge } from '../../lib/badges';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import './community.css';

const STRATEGY_TAGS = [
  'Breakout', 'Pullback', 'SupportBounce', 'ResistanceRejection',
  'HighVolume', 'Reversal', 'Momentum', 'GapUp', 'GapDown'
];

const TIMEFRAMES = ['Intraday', 'Swing', 'Positional'];
const SENTIMENTS = ['Bullish', 'Bearish', 'Neutral'];

const TAG_ICONS = {
  Breakout: '🚀', Pullback: '📉', SupportBounce: '🔄', ResistanceRejection: '🛑',
  HighVolume: '📊', Reversal: '↩️', Momentum: '⚡', GapUp: '🟢', GapDown: '🔴'
};

const SENTIMENT_COLORS = {
  Bullish: 'var(--green)', Bearish: 'var(--red)', Neutral: 'var(--yellow)'
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// ─── Animated Counter Component ───
function AnimatedNumber({ value, duration = 600 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <span>{display}</span>;
}

// ─── Sentiment Gauge Component ───
function SentimentGauge({ bullish, bearish, neutral }) {
  const total = bullish + bearish + neutral || 1;
  const bullPct = Math.round((bullish / total) * 100);
  const bearPct = Math.round((bearish / total) * 100);
  const neutralPct = 100 - bullPct - bearPct;
  const angle = (bullPct / 100) * 360;

  return (
    <div className="sentiment-gauge">
      <div className="gauge-ring" style={{
        background: `conic-gradient(var(--green) 0deg, var(--green) ${angle}deg, var(--red) ${angle}deg, var(--red) ${angle + (bearPct / 100) * 360}deg, var(--yellow) ${angle + (bearPct / 100) * 360}deg, var(--yellow) 360deg)`
      }}>
        <div className="gauge-inner">
          <span className="gauge-value" style={{ color: bullPct >= bearPct ? 'var(--green)' : 'var(--red)' }}>
            {bullPct >= bearPct ? bullPct : bearPct}%
          </span>
          <span className="gauge-label">{bullPct >= bearPct ? 'Bullish' : 'Bearish'}</span>
        </div>
      </div>
      <div className="gauge-legend">
        <div className="gauge-legend-item">
          <span className="gauge-dot" style={{ background: 'var(--green)' }} />
          <span>Bullish {bullPct}%</span>
        </div>
        <div className="gauge-legend-item">
          <span className="gauge-dot" style={{ background: 'var(--red)' }} />
          <span>Bearish {bearPct}%</span>
        </div>
        <div className="gauge-legend-item">
          <span className="gauge-dot" style={{ background: 'var(--yellow)' }} />
          <span>Neutral {neutralPct}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Confidence Badge Component ───
function ConfidenceBadge({ level }) {
  const colors = { High: 'var(--green)', Medium: 'var(--yellow)', Low: 'var(--red)' };
  const icons = { High: '🎯', Medium: '📍', Low: '❓' };
  return (
    <span className="confidence-badge" style={{ '--conf-color': colors[level] || colors.Medium }}>
      {icons[level]} {level}
    </span>
  );
}


export default function CommunityClient({
  initialPosts = [],
  initialTrending = [],
  initialSignals = [],
  initialSentiment = { bullish: 0, bearish: 0, neutral: 0, totalPosts: 0 },
  initialAnalysts = [],
}) {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('new');

  // Filters
  const [activeTag, setActiveTag] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState(null);
  const [activeSentiment, setActiveSentiment] = useState(null);
  const [watchlistOnly, setWatchlistOnly] = useState(false);

  // Right panel data
  const [trending, setTrending] = useState(initialTrending);
  const [signals, setSignals] = useState(initialSignals);
  const [sentiment, setSentiment] = useState(initialSentiment);
  const [analysts, setAnalysts] = useState(initialAnalysts);

  // Create Post form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    stockName: '', strategyTag: 'Breakout', timeframe: 'Swing',
    sentiment: 'Bullish', confidence: 'Medium', title: '', body: '',
    targetPrice: '', stopLoss: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deletePostId, setDeletePostId] = useState(null);

  // Mobile panel toggle
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Track whether user has changed sort/filters from initial state
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Fetch posts with filters (only when user changes sort/filters)
  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams({ sort });
      if (activeTag) params.set('strategyTag', activeTag);
      if (activeTimeframe) params.set('timeframe', activeTimeframe);
      if (activeSentiment) params.set('sentiment', activeSentiment);
      if (watchlistOnly && session?.user) {
        // fetch watchlist from user data
        try {
          const uRes = await fetch('/api/user/profile');
          const uData = await uRes.json();
          if (uData?.watchlist?.length) {
            params.set('watchlist', uData.watchlist.join(','));
          }
        } catch (e) { /* ignore */ }
      }
      const res = await fetch(`/api/community/posts?${params}`);
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [sort, activeTag, activeTimeframe, activeSentiment, watchlistOnly, session]);

  // Only re-fetch when user interacts with sort/filters
  useEffect(() => {
    if (!hasUserInteracted) return;
    setLoading(true);
    fetchPosts();
  }, [fetchPosts, hasUserInteracted]);

  // Fetch right panel data (client-side refresh)
  useEffect(() => {
    const fetchRightPanel = async () => {
      try {
        const [trendRes, sigRes, sentRes, analRes] = await Promise.all([
          fetch('/api/community/trending'),
          fetch('/api/community/signals'),
          fetch('/api/community/sentiment'),
          fetch('/api/community/analysts')
        ]);
        const [trendData, sigData, sentData, analData] = await Promise.all([
          trendRes.json(), sigRes.json(), sentRes.json(), analRes.json()
        ]);
        if (trendData.success) setTrending(trendData.data);
        if (sigData.success) setSignals(sigData.data);
        if (sentData.success) setSentiment(sentData.data);
        if (analData.success) setAnalysts(analData.data);
      } catch (e) {
        console.error('Right panel fetch error:', e);
      }
    };
    // Delay initial client refresh so SSR data shows first
    const timeout = setTimeout(fetchRightPanel, 5000);
    const interval = setInterval(fetchRightPanel, 60000); // refresh every minute
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  // Helper to mark user interaction when changing sort/filters
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setHasUserInteracted(true);
  };

  // Submit post
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.stockName.trim() || !formData.title.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stockName: formData.stockName.trim().toUpperCase(),
          title: formData.title.trim(),
          body: formData.body.trim(),
          targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : null,
          stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null
        })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => [data.data, ...prev]);
        setFormData({
          stockName: '', strategyTag: 'Breakout', timeframe: 'Swing',
          sentiment: 'Bullish', confidence: 'Medium', title: '', body: '',
          targetPrice: '', stopLoss: ''
        });
        setShowForm(false);
      } else {
        alert(data.error || 'Failed to post');
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Vote
  const handleVote = async (e, postId, vote) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (status !== 'authenticated') return;
    try {
      const res = await fetch(`/api/community/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if ((p._id || p.id) === postId) return { ...p, _voteData: data.data };
          return p;
        }));
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const getScore = (post) => post._voteData ? post._voteData.score : (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
  const getUserVote = (post) => post._voteData ? post._voteData.userVote : null;



  const clearFilters = () => {
    setActiveTag(null);
    setActiveTimeframe(null);
    setActiveSentiment(null);
    setWatchlistOnly(false);
    setHasUserInteracted(true);
  };

  const hasFilters = activeTag || activeTimeframe || activeSentiment || watchlistOnly;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />

        {/* Mobile Backdrop */
        (showLeftPanel || showRightPanel) && (
          <div
            className="mobile-backdrop"
            onClick={() => { setShowLeftPanel(false); setShowRightPanel(false); }}
          />
        )}

        {/* Mobile Panel Toggles */}
        <div className="community-mobile-toggles">
          <button className={`mobile-toggle-btn ${showLeftPanel ? 'active' : ''}`} onClick={() => { setShowLeftPanel(!showLeftPanel); setShowRightPanel(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            Filters
          </button>
          <button className={`mobile-toggle-btn ${showRightPanel ? 'active' : ''}`} onClick={() => { setShowRightPanel(!showRightPanel); setShowLeftPanel(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Insights
          </button>
        </div>

        <div className="community-page">
          <h1 className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Community — Discuss Stocks, Share Analysis & Insights</h1>

          {/* ═══════════════════════════════════════════════════════════
             LEFT PANEL — Filter Insights
             ═══════════════════════════════════════════════════════════ */}
          <aside className={`community-left-panel ${showLeftPanel ? 'mobile-show' : ''}`}>
            <div className="panel-glass">
              {/* Watchlist Filter */}
              {status === 'authenticated' && (
                <div className="filter-section">
                  <h4 className="filter-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Watchlist
                  </h4>
                  <button
                    className={`watchlist-filter-btn ${watchlistOnly ? 'active' : ''}`}
                    onClick={() => { setWatchlistOnly(!watchlistOnly); setHasUserInteracted(true); }}
                  >
                    <span className="wf-icon">📋</span>
                    <span className="wf-text">
                      <strong>Your Stocks</strong>
                      <small>Posts about your watchlist</small>
                    </span>
                    <span className={`wf-toggle ${watchlistOnly ? 'on' : ''}`}>
                      <span className="wf-toggle-dot" />
                    </span>
                  </button>
                </div>
              )}

              {/* Strategy Tags */}
              <div className="filter-section">
                <h4 className="filter-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  Strategy Tags
                </h4>
                <div className="strategy-tags-grid">
                  {STRATEGY_TAGS.map(tag => (
                    <button
                      key={tag}
                      className={`strategy-tag-btn tag-${tag} ${activeTag === tag ? 'active' : ''}`}
                      onClick={() => { setActiveTag(activeTag === tag ? null : tag); setHasUserInteracted(true); }}
                    >
                      <span className="tag-icon">{TAG_ICONS[tag]}</span>
                      <span className="tag-name">{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeframe Filter */}
              <div className="filter-section">
                <h4 className="filter-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Timeframe
                </h4>
                <div className="timeframe-pills">
                  {TIMEFRAMES.map(tf => (
                    <button
                      key={tf}
                      className={`timeframe-pill ${activeTimeframe === tf ? 'active' : ''} ${tf === 'Swing' ? 'default-tag' : ''}`}
                      onClick={() => { setActiveTimeframe(activeTimeframe === tf ? null : tf); setHasUserInteracted(true); }}
                    >
                      {tf === 'Intraday' && '⚡'}
                      {tf === 'Swing' && '🔄'}
                      {tf === 'Positional' && '🏗️'}
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sentiment Filter */}
              <div className="filter-section">
                <h4 className="filter-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  Sentiment
                </h4>
                <div className="sentiment-pills">
                  {SENTIMENTS.map(s => (
                    <button
                      key={s}
                      className={`sentiment-pill sentiment-${s.toLowerCase()} ${activeSentiment === s ? 'active' : ''}`}
                      onClick={() => { setActiveSentiment(activeSentiment === s ? null : s); setHasUserInteracted(true); }}
                    >
                      {s === 'Bullish' && '📈'}
                      {s === 'Bearish' && '📉'}
                      {s === 'Neutral' && '➖'}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════════
             CENTER FEED — Structured Insight Cards
             ═══════════════════════════════════════════════════════════ */}
          <div className="community-feed">
            {/* Sort Tabs */}
            <div className="community-sort">
              <button className={`community-sort-btn ${sort === 'best' ? 'active' : ''}`} onClick={() => handleSortChange('best')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                Best
              </button>
              <button className={`community-sort-btn ${sort === 'hot' ? 'active' : ''}`} onClick={() => handleSortChange('hot')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 23c-3.866 0-7-3.134-7-7 0-3 2-5 3-7 .562-.893 1.07-1.968 1-3 2.5 1.5 4 4 4 6.5.5-1.5 1-2.5 1-2.5 1 2 2 3 2 5.5 0 3.866-1.134 7.5-4 7.5z" /></svg>
                Hot
              </button>
              <button className={`community-sort-btn ${sort === 'new' ? 'active' : ''}`} onClick={() => handleSortChange('new')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                New
              </button>
              <div style={{ flex: 1 }} />
              {hasFilters && (
                <span className="active-filters-count">{[activeTag, activeTimeframe, activeSentiment, watchlistOnly ? 'W' : null].filter(Boolean).length} filters</span>
              )}
            </div>

            {/* Create Insight Placeholder */}
            {status === 'authenticated' && !showForm && (
              <div className="community-create-placeholder" onClick={() => setShowForm(true)}>
                <div className="create-placeholder-top">
                  {session?.user && (session.user.profilePic || session.user.image) ? (
                    <img src={session.user.profilePic || session.user.image} alt="" className="create-placeholder-avatar" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="create-placeholder-avatar default">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="create-placeholder-title">Share a trading insight...</span>
                </div>
                
                <div className="create-placeholder-box">
                  <span className="create-placeholder-text">What's your analysis on the market today? Drop a stock ticker, strategy, or chart setup...</span>
                </div>

                <div className="create-placeholder-footer">
                  <div className="create-placeholder-badges">
                    <span className="tag-badge">🚀 Strategy</span>
                    <span className="tag-badge">⏱️ Timeframe</span>
                    <span className="tag-badge">📈 Sentiment</span>
                  </div>
                  <button className="community-btn community-btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Create</button>
                </div>
              </div>
            )}

            {/* Create Insight Placeholder (Unauthenticated) */}
            {status !== 'authenticated' && (
              <div className="community-create-placeholder unauth" onClick={() => signIn('google')}>
                <div className="create-placeholder-top">
                  <div className="create-placeholder-avatar default">
                    ?
                  </div>
                  <span className="create-placeholder-title">Share a trading insight...</span>
                </div>
                
                <div className="create-placeholder-box">
                  <span className="create-placeholder-text">What's your analysis on the market today? Drop a stock ticker, strategy, or chart setup...</span>
                </div>

                <div className="create-placeholder-footer">
                  <div className="create-placeholder-badges">
                    <span className="tag-badge">🚀 Strategy</span>
                    <span className="tag-badge">⏱️ Timeframe</span>
                    <span className="tag-badge">📈 Sentiment</span>
                  </div>
                  <button className="community-btn community-btn-primary" onClick={(e) => { e.stopPropagation(); signIn('google'); }} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Sign in to post</button>
                </div>
              </div>
            )}

            {/* ─── Structured Insight Post Form ─── */}
            {showForm && (
              <form className="insight-create-form" onSubmit={handleSubmit}>
                <div className="insight-form-header">
                  <span className="insight-form-title">🧾 Share Trading Insight</span>
                  <button type="button" className="community-form-close" onClick={() => setShowForm(false)}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>

                {/* Row 1: Stock + Sentiment */}
                <div className="insight-form-row">
                  <div className="insight-form-field flex-2">
                    <label>Title / Ticker *</label>
                    <input
                      type="text"
                      placeholder="e.g. RELIANCE or IT Sector Outlook"
                      value={formData.stockName}
                      onChange={e => setFormData(p => ({ ...p, stockName: e.target.value.toUpperCase() }))}
                      className="insight-stock-input"
                      autoFocus
                    />
                  </div>
                  <div className="insight-form-field flex-1">
                    <label>Sentiment</label>
                    <div className="sentiment-toggle">
                      {SENTIMENTS.map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`sentiment-toggle-btn ${formData.sentiment === s ? `active sentiment-${s.toLowerCase()}` : ''}`}
                          onClick={() => setFormData(p => ({ ...p, sentiment: s }))}
                        >
                          {s === 'Bullish' ? '📈' : s === 'Bearish' ? '📉' : '➖'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 2: Strategy Tag */}
                <div className="insight-form-field">
                  <label>Strategy Tag *</label>
                  <div className="strategy-tag-select">
                    {STRATEGY_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`strategy-tag-option tag-${tag} ${formData.strategyTag === tag ? 'active' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, strategyTag: tag }))}
                      >
                        {TAG_ICONS[tag]} {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 3: Timeframe + Confidence */}
                <div className="insight-form-row">
                  <div className="insight-form-field flex-1">
                    <label>Timeframe</label>
                    <div className="timeframe-select">
                      {TIMEFRAMES.map(tf => (
                        <button
                          key={tf}
                          type="button"
                          className={`tf-select-btn ${formData.timeframe === tf ? 'active' : ''}`}
                          onClick={() => setFormData(p => ({ ...p, timeframe: tf }))}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="insight-form-field flex-1">
                    <label>Confidence</label>
                    <div className="confidence-select">
                      {['High', 'Medium', 'Low'].map(c => (
                        <button
                          key={c}
                          type="button"
                          className={`conf-select-btn conf-${c.toLowerCase()} ${formData.confidence === c ? 'active' : ''}`}
                          onClick={() => setFormData(p => ({ ...p, confidence: c }))}
                        >
                          {c === 'High' ? '🎯' : c === 'Medium' ? '📍' : '❓'} {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 4: Target + StopLoss */}
                <div className="insight-form-row">
                  <div className="insight-form-field flex-1">
                    <label>Target Price ₹ <small>(optional)</small></label>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={formData.targetPrice}
                      onChange={e => setFormData(p => ({ ...p, targetPrice: e.target.value }))}
                    />
                  </div>
                  <div className="insight-form-field flex-1">
                    <label>Stop Loss ₹ <small>(optional)</small></label>
                    <input
                      type="number"
                      placeholder="e.g. 1350"
                      value={formData.stopLoss}
                      onChange={e => setFormData(p => ({ ...p, stopLoss: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Row 5: Reason */}
                <div className="insight-form-field">
                  <label>Analysis Reason *</label>
                  <input
                    type="text"
                    placeholder="e.g. Resistance broken at ₹1400, Volume increasing"
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    maxLength={300}
                  />
                </div>

                {/* Row 6: Additional Notes */}
                <div className="insight-form-field">
                  <label>Additional Notes <small>(optional)</small></label>
                  <textarea
                    placeholder="Detailed analysis, chart observations, context..."
                    value={formData.body}
                    onChange={e => setFormData(p => ({ ...p, body: e.target.value }))}
                    maxLength={10000}
                  />
                </div>

                <div className="insight-form-actions">
                  <button type="button" className="community-btn community-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="community-btn community-btn-primary" disabled={!formData.stockName.trim() || !formData.title.trim() || submitting}>
                    {submitting ? 'Publishing...' : '🧾 Publish Insight'}
                  </button>
                </div>
              </form>
            )}

            {/* ─── Insight Card Feed ─── */}
            {loading ? (
              <div className="community-loading"><div className="community-spinner" /></div>
            ) : posts.length === 0 ? (
              <div className="community-empty">
                <div className="empty-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3>No insights yet</h3>
                <p>{hasFilters ? 'No insights match your current filters. Try adjusting them.' : 'Be the first to share a trading insight!'}</p>
                {hasFilters && <button className="community-btn community-btn-secondary" onClick={clearFilters} style={{ marginTop: 12 }}>Clear Filters</button>}
              </div>
            ) : (
              posts.map(post => (
                <Link key={post._id} href={`/community/${post._id}`} className={`insight-card sentiment-border-${(post.sentiment || 'neutral').toLowerCase()}`} onClick={(e) => {
                  // Don't navigate if clicking on a button or inside .insight-actions
                  if (e.target.closest('button') || e.target.closest('.insight-actions') || e.target.closest('.insight-vote-group')) e.preventDefault();
                }}>
                    {/* Card Header */}
                    <div className="insight-card-header">
                      <div className="insight-stock-badge">
                        <span className="stock-ticker">{post.stockName || 'N/A'}</span>
                        <span className={`insight-sentiment-dot sentiment-${(post.sentiment || 'neutral').toLowerCase()}`} />
                      </div>
                      <span className={`insight-strategy-tag tag-${post.strategyTag}`}>
                        {TAG_ICONS[post.strategyTag]} {post.strategyTag}
                      </span>
                      <span className="insight-timeframe">{post.timeframe || 'Swing'}</span>
                      <ConfidenceBadge level={post.confidence || 'Medium'} />
                    </div>

                    {/* Card Body */}
                    <div className="insight-card-body">
                      <h3 className="insight-reason">{post.title}</h3>
                      {post.body && <p className="insight-detail" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />}

                      {/* Price targets */}
                      {(post.targetPrice || post.stopLoss) && (
                        <div className="insight-prices">
                          {post.targetPrice && (
                            <span className="insight-price target">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                              Target: ₹{post.targetPrice}
                            </span>
                          )}
                          {post.stopLoss && (
                            <span className="insight-price stoploss">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                              SL: ₹{post.stopLoss}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="insight-card-footer">
                      <div className="insight-author">
                        {post.authorImage && <img src={post.authorImage} alt="" className="insight-author-pic" referrerPolicy="no-referrer" />}
                        <span className="insight-author-name" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {post.authorUsername ? `u/${post.authorUsername}` : post.authorName}
                          {getUserBadge(post.authorUsername) && <span className={getUserBadge(post.authorUsername).className}>{getUserBadge(post.authorUsername).label}</span>}
                        </span>
                        <span className="insight-time">• {timeAgo(post.createdAt)}</span>
                      </div>
                      <div className="insight-actions">
                        <div className="insight-vote-group">
                          <button className={`vote-btn-mini ${getUserVote(post) === 'up' ? 'upvoted' : ''}`} onClick={() => handleVote(null, post._id, 'up')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                          </button>
                          <span className="vote-score-mini">{getScore(post)}</span>
                          <button className={`vote-btn-mini ${getUserVote(post) === 'down' ? 'downvoted' : ''}`} onClick={() => handleVote(null, post._id, 'down')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                          </button>
                        </div>
                        <span className="insight-comment-count">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                          {post.commentCount || 0}
                        </span>
                        <button className="insight-share-btn" onClick={() => navigator.clipboard.writeText(window.location.origin + '/community/' + post._id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                        </button>
                        {session?.user && (String(post.author?._id || post.author) === session.user.dbId || ["vinitsingh665@gmail.com", "vinits.7kushwaha@gmail.com"].includes(session.user.email)) && (
                          <button 
                            className="insight-share-btn" 
                            title="Delete post" 
                            type="button"
                            onClick={(e) => { 
                              e.preventDefault();
                              e.stopPropagation(); 
                              setDeletePostId(String(post._id)); 
                            }} 
                            style={{ color: 'var(--text-dim)' }} 
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--red-bright)'} 
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
              ))
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
             RIGHT PANEL — Aggregated Intelligence
             ═══════════════════════════════════════════════════════════ */}
          <aside className={`community-right-panel ${showRightPanel ? 'mobile-show' : ''}`}>

            {/* 🔥 Most Discussed Stocks */}
            <div className="panel-glass right-section">
              <h4 className="right-section-title">
                <span className="section-icon">🔥</span> Most Discussed
              </h4>
              {trending.length > 0 ? trending.slice(0, 5).map((stock, i) => (
                <div key={stock.stockName} className="trending-stock-item">
                  <div className="trending-rank">#{i + 1}</div>
                  <div className="trending-info">
                    <span className="trending-name">{stock.stockName}</span>
                    <span className="trending-meta">
                      {stock.bullishCount} 📈 / {stock.bearishCount} 📉
                    </span>
                  </div>
                  <div className="trending-count">
                    <AnimatedNumber value={stock.postCount} />
                    <small>posts</small>
                  </div>
                  {i === 0 && <span className="pulse-dot" />}
                </div>
              )) : (
                <div className="right-empty">No trending stocks yet. Start posting!</div>
              )}
            </div>

            {/* 📈 Strong Signals */}
            <div className="panel-glass right-section">
              <h4 className="right-section-title">
                <span className="section-icon">📈</span> Strong Signals
              </h4>
              {signals.length > 0 ? signals.slice(0, 4).map(sig => (
                <div key={sig.stockName} className="signal-card">
                  <div className="signal-header">
                    <span className="signal-stock">{sig.stockName}</span>
                    <ConfidenceBadge level={sig.confidence} />
                  </div>
                  <div className="signal-body">
                    <span className="signal-text">
                      <strong>{sig.contributorCount}</strong> {sig.contributorCount === 1 ? 'user' : 'users'} spotted <strong>{sig.topStrategies?.[0] || 'pattern'}</strong>
                    </span>
                  </div>
                  <div className="signal-bar">
                    <div className="signal-bar-fill" style={{
                      width: `${sig.agreement}%`,
                      background: sig.dominantSentiment === 'Bullish' ? 'var(--green)' : 'var(--red)'
                    }} />
                  </div>
                  <span className="signal-agreement">{sig.agreement}% agreement • {sig.dominantSentiment}</span>
                </div>
              )) : (
                <div className="right-empty">No signals detected yet today.</div>
              )}
            </div>

            {/* 🧠 Market Sentiment */}
            <div className="panel-glass right-section">
              <h4 className="right-section-title">
                <span className="section-icon">🧠</span> Market Sentiment
              </h4>
              <SentimentGauge
                bullish={sentiment.bullish || 0}
                bearish={sentiment.bearish || 0}
                neutral={sentiment.neutral || 0}
              />
              <div className="sentiment-post-count">
                Based on <strong><AnimatedNumber value={sentiment.totalPosts || 0} /></strong> posts today
              </div>
            </div>

            {/* 🏆 Top Analysts */}
            <div className="panel-glass right-section">
              <h4 className="right-section-title">
                <span className="section-icon">🏆</span> Top Analysts
              </h4>
              {analysts.length > 0 ? analysts.slice(0, 5).map((a, i) => (
                <div key={a.authorId || i} className="analyst-item">
                  <div className="analyst-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                  {a.authorImage && <img src={a.authorImage} alt="" className="analyst-avatar" referrerPolicy="no-referrer" />}
                  <div className="analyst-info">
                    <span className="analyst-name">{a.authorUsername ? `u/${a.authorUsername}` : a.authorName}</span>
                    <span className="analyst-stats">
                      {a.accuracyScore}% accuracy • {a.totalPosts} calls
                    </span>
                  </div>
                  <div className="analyst-score">
                    <span className="analyst-engagement">{a.engagementScore}</span>
                    <small>score</small>
                  </div>
                </div>
              )) : (
                <div className="right-empty">No analyst data yet. Be the first!</div>
              )}
            </div>

          </aside>

        </div>
      </div>

      {/* ─── Delete Confirmation Modal ─── */}
      {deletePostId && (
        <div className="delete-modal-overlay" onClick={() => setDeletePostId(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ff4d4f" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 className="delete-modal-title">Delete Post</h3>
            <p className="delete-modal-text">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn cancel" onClick={() => setDeletePostId(null)}>Cancel</button>
              <button className="delete-modal-btn confirm" onClick={() => {
                fetch(`/api/community/posts/${deletePostId}`, { method: 'DELETE' })
                  .then(r => r.json())
                  .then(data => {
                    if (data.success) setPosts(prev => prev.filter(p => (p._id || p.id) !== deletePostId));
                    else alert(data.error || 'Failed to delete');
                  })
                  .catch(err => console.error(err))
                  .finally(() => setDeletePostId(null));
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
