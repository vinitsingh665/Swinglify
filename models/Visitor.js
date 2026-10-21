import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userEmail: {
    type: String,
    default: null
  },
  ip: String,
  path: String,
  userAgent: String,
  lastActive: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically delete inactive record after 24 hours (cleanup)
  }
});

VisitorSchema.index({ userId: 1, lastActive: -1 });
VisitorSchema.index({ userEmail: 1, lastActive: -1 });

// Reset cached model in dev if schema changed
if (mongoose.models.Visitor && !mongoose.models.Visitor.schema.paths.userId) {
  delete mongoose.models.Visitor;
}

// Avoid re-compiling the model
export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);

