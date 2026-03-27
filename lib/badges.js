/**
 * User Title Badges — maps usernames to special badges shown in the Community Hub.
 * Add new entries here to grant titles to specific users.
 */
const USER_BADGES = {
  'SwinglifyAI': { label: '🤖 AI Analyst', className: 'ai-analyst-badge' },
  'vinit':       { label: '👑 Founder',    className: 'founder-badge' },
  'swinglify':   { label: '⚡ Admin',      className: 'admin-badge' },
};

export function getUserBadge(username) {
  if (!username) return null;
  return USER_BADGES[username] || null;
}
