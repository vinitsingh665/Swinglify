import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bug', 'contact', 'feedback'],
    default: 'contact'
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'resolved', 'archived'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid re-compiling the model if it already exists
export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
