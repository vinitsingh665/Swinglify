import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  ip: String,
  path: String,
  userAgent: String,
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically delete inactive record after 24 hours (cleanup)
  }
});

// Avoid re-compiling the model
export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
