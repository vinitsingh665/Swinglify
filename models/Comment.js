import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
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
  body: {
    type: String,
    required: true,
    maxlength: 5000
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null  // null = top-level comment
  },
  upvotes: {
    type: [String],
    default: []
  },
  downvotes: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CommentSchema.virtual('score').get(function () {
  return (this.upvotes?.length || 0) - (this.downvotes?.length || 0);
});

CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

// Prevent Mongoose HMR cache issues in development
if (mongoose.models.Comment) {
  delete mongoose.models.Comment;
}

export default mongoose.model('Comment', CommentSchema);
