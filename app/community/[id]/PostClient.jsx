"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import { getUserBadge } from '../../../lib/badges';
import '../community.css';

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

export default function PostClient({ id, initialPost, initialComments }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingSubmitting, setReplyingSubmitting] = useState(false);
  const [voteData, setVoteData] = useState(null);

  const handleVote = async (vote) => {
    if (status !== 'authenticated') return;
    try {
      const res = await fetch(`/api/community/posts/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
      const data = await res.json();
      if (data.success) setVoteData(data.data);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentText })
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [data.data, ...prev]);
        setCommentText('');
        setPost(prev => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : prev);
      }
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim() || replyingSubmitting) return;
    setReplyingSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyText, parentId })
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [...prev, data.data]);
        setReplyText('');
        setReplyTo(null);
        setPost(prev => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : prev);
      }
    } catch (err) {
      console.error('Reply failed:', err);
    } finally {
      setReplyingSubmitting(false);
    }
  };

  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId).sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

  const renderComment = (comment, isReply = false) => {
    const replies = getReplies(comment._id);
    return (
      <div key={comment._id} className={`comment-item ${isReply ? 'comment-reply' : ''}`} style={isReply ? { marginLeft: '32px', marginTop: '12px', borderLeft: '2px solid var(--border)', paddingLeft: '16px', background: 'transparent' } : {}}>
        {comment.authorImage ? (
          <img src={comment.authorImage} alt="" className="comment-avatar" referrerPolicy="no-referrer" />
        ) : (
          <div className="comment-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-bg)', color: 'var(--accent)', fontWeight: 700, fontSize: '0.7rem' }}>
            {comment.authorName?.charAt(0)?.toUpperCase()}
          </div>
        )}
        <div className="comment-body-wrap" style={{ flex: 1 }}>
          <div className="comment-meta">
            <span className="comment-author" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {comment.authorUsername ? `u/${comment.authorUsername}` : comment.authorName}
              {getUserBadge(comment.authorUsername) && <span className={getUserBadge(comment.authorUsername).className}>{getUserBadge(comment.authorUsername).label}</span>}
            </span>
            <span>•</span>
            <span>{timeAgo(comment.createdAt)}</span>
          </div>
          <div className="comment-text">{comment.body}</div>
          
          <div className="comment-actions" style={{ marginTop: '8px' }}>
            <button onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
              Reply
            </button>
          </div>

          {replyTo === comment._id && status === 'authenticated' && (
            <div className="inline-reply-form" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea 
                autoFocus
                placeholder={`Replying to ${comment.authorUsername || comment.authorName}...`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                style={{ width: '100%', minHeight: '60px', padding: '10px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={() => setReplyTo(null)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                <button onClick={() => handleReply(comment._id)} disabled={!replyText.trim() || replyingSubmitting} style={{ padding: '6px 16px', borderRadius: '6px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>{replyingSubmitting ? 'Posting...' : 'Reply'}</button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="comment-replies" style={{ marginTop: '12px' }}>
              {replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getScore = () => {
    if (voteData) return voteData.score;
    if (!post) return 0;
    return (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
  };

  const getUserVote = () => {
    if (voteData) return voteData.userVote;
    return null;
  };



  if (!post) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <TopBar />
          <div className="post-detail">
            <div className="community-empty">
              <h3>Post not found</h3>
              <p>This post may have been deleted.</p>
              <Link href="/community" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>← Back to Community</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="post-detail">
      {/* Back link & Close button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/community" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Community
        </Link>
        <Link href="/community" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'var(--red-bg)'; e.currentTarget.style.color = 'var(--red-bright)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-muted)'; }} title="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </Link>
      </div>

      {/* Post Detail Card (Using Insight Card styling approach) */}
      <div className={`insight-card sentiment-border-${post.sentiment?.toLowerCase() || 'neutral'}`} style={{ marginBottom: '20px', cursor: 'default' }}>
        <div className="insight-card-header" style={{ paddingTop: '16px' }}>
          <div className="insight-stock-badge">
            <span className="stock-ticker">{post.stockName || 'N/A'}</span>
            <div className={`insight-sentiment-dot sentiment-${post.sentiment?.toLowerCase() || 'neutral'}`} />
          </div>
          {post.strategyTag && <span className={`insight-strategy-tag tag-${post.strategyTag.replace(/\s+/g, '')}`}>🚀 {post.strategyTag.toUpperCase()}</span>}
          <span className="insight-timeframe">{post.timeframe || 'Swing'}</span>
          <div className={`confidence-badge conf-${post.confidence?.toLowerCase() || 'medium'}`} style={{ '--conf-color': post.confidence === 'High' ? 'var(--green)' : post.confidence === 'Low' ? 'var(--red)' : 'var(--yellow)' }}>
            {post.confidence === 'High' ? '🎯' : post.confidence === 'Low' ? '❓' : '⚡'} {post.confidence}
          </div>
        </div>

        <div className="insight-card-body" style={{ padding: '16px 20px' }}>
          <h1 className="insight-reason" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{post.title}</h1>
          {post.body && <div className="insight-detail" style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', display: 'block', WebkitLineClamp: 'unset', overflow: 'visible', margin: '16px 0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />}
          
          {(post.targetPrice || post.stopLoss) && (
            <div className="insight-prices" style={{ marginTop: '16px', gap: '16px' }}>
              {post.targetPrice && (
                <div className="insight-price target" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Target: /u20B9{post.targetPrice}
                </div>
              )}
              {post.stopLoss && (
                <div className="insight-price stoploss" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  SL: /u20B9{post.stopLoss}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="insight-card-footer" style={{ padding: '12px 20px' }}>
          <div className="insight-author">
            {post.authorImage ? (
              <img src={post.authorImage} alt="" className="insight-author-pic" referrerPolicy="no-referrer" style={{ width: '24px', height: '24px' }} />
            ) : (
              <div className="insight-author-pic" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-bg)', color: 'var(--accent)', fontWeight: 700, fontSize: '0.65rem' }}>
                {post.authorName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <span className="insight-author-name" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {post.authorUsername ? `u/${post.authorUsername}` : post.authorName}
              {getUserBadge(post.authorUsername) && <span className={getUserBadge(post.authorUsername).className}>{getUserBadge(post.authorUsername).label}</span>}
            </span>
            <span className="insight-time">• {timeAgo(post.createdAt)}</span>
          </div>
          
          <div className="insight-actions">
            <div className="insight-vote-group">
              <button className={`vote-btn-mini ${getUserVote() === 'up' ? 'upvoted' : ''}`} onClick={() => handleVote('up')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
              </button>
              <span className="vote-score-mini" style={{ width: '20px' }}>{getScore()}</span>
              <button className={`vote-btn-mini ${getUserVote() === 'down' ? 'downvoted' : ''}`} onClick={() => handleVote('down')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
            </div>
            <div className="insight-comment-count">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              {post.commentCount || 0}
            </div>
            <button className="insight-share-btn" onClick={() => navigator.clipboard.writeText(window.location.href)} title="Copy Link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
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
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <div className="comments-header">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</div>

        {/* Comment Form */}
        {status === 'authenticated' ? (
          <div className="comment-form">
            <textarea
              placeholder="What are your thoughts?"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              maxLength={5000}
            />
            <div className="comment-form-actions">
              <button className="community-btn community-btn-primary" onClick={handleComment} disabled={!commentText.trim() || submitting}>
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        ) : (
          <div className="community-login-prompt" style={{ marginBottom: '16px' }}>
            <p>Sign in to comment</p>
            <button className="community-btn community-btn-primary" onClick={() => signIn('google')}>Sign In with Google</button>
          </div>
        )}

        {/* Comment List */}
        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.filter(c => !c.parentId).map(comment => renderComment(comment))
        )}
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
                    if (data.success) router.push('/community');
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
      </div>
    </div>
  );
}
