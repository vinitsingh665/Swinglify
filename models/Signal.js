import mongoose from 'mongoose';

const SignalSchema = new mongoose.Schema({
  stockName: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  bullishCount: {
    type: Number,
    default: 0
  },
  bearishCount: {
    type: Number,
    default: 0
  },
  neutralCount: {
    type: Number,
    default: 0
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  topStrategies: {
    type: [String],
    default: []
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

SignalSchema.index({ stockName: 1, date: 1 }, { unique: true });
SignalSchema.index({ totalPosts: -1 });

export default mongoose.models.Signal || mongoose.model('Signal', SignalSchema);
