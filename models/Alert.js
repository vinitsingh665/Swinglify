import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  comparison: {
    type: String,
    enum: ['Above', 'Below', 'Crosses'],
    default: 'Above'
  },
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['price', 'volume', 'rsi'],
    default: 'price'
  },
  triggered: {
    type: Boolean,
    default: false
  },
  expired: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

if (mongoose.models.Alert) {
  delete mongoose.models.Alert;
}

export default mongoose.model('Alert', AlertSchema);
