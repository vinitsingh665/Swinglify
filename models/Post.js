import mongoose from 'mongoose';

const STRATEGY_TAGS = [
  'Breakout', 'Pullback', 'SupportBounce', 'ResistanceRejection',
  'HighVolume', 'Reversal', 'Momentum', 'GapUp', 'GapDown'
];

const TIMEFRAMES = ['Intraday', 'Swing', 'Positional'];

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorUsername: {
    type: String,
    default: ''
  },
  authorImage: {
    type: String,
    default: ''
  },
  // ─── Structured Insight Fields ───
  stockName: {
    type: String,
    uppercase: true,
    trim: true,
    default: ''
  },
  strategyTag: {
    type: String,
    enum: [...STRATEGY_TAGS, ''],
    default: ''
  },
  timeframe: {
    type: String,
    enum: TIMEFRAMES,
    default: 'Swing'
  },
  sentiment: {
    type: String,
    enum: ['Bullish', 'Bearish', 'Neutral'],
    default: 'Bullish'
  },
  confidence: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  targetPrice: {
    type: Number,
    default: null
  },
  stopLoss: {
    type: Number,
    default: null
  },
  // ─── Content ───
  title: {
    type: String,
    maxlength: 300,
    default: ''
  },
  body: {
    type: String,
    default: '',
    maxlength: 10000
  },
  flair: {
    type: String,
    enum: ['Discussion', 'DD', 'News', 'Meme', 'Question', 'Strategy'],
    default: 'Strategy'
  },
  upvotes: {
    type: [String],
    default: []
  },
  downvotes: {
    type: [String],
    default: []
  },
  commentCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for net score
PostSchema.virtual('score').get(function () {
  return (this.upvotes?.length || 0) - (this.downvotes?.length || 0);
});

// Ensure virtuals are included in JSON
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

// Index for efficient querying
PostSchema.index({ stockName: 1, createdAt: -1 });
PostSchema.index({ strategyTag: 1 });
PostSchema.index({ timeframe: 1 });
PostSchema.index({ sentiment: 1 });

// Prevent Mongoose HMR cache issues in development
if (mongoose.models.Post) {
  delete mongoose.models.Post;
}

export default mongoose.model('Post', PostSchema);
