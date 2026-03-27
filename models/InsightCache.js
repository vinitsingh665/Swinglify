import mongoose from 'mongoose';

const InsightCacheSchema = new mongoose.Schema({
  ticker: { 
    type: String, 
    required: true, 
    unique: true 
  },
  insightText: { 
    type: String, 
    required: true 
  },
  dateString: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    expires: '24h', // Automatically delete document after 24 hours
    default: Date.now 
  }
});

// Prevent Mongoose HMR cache issues in development
if (mongoose.models.InsightCache) {
  delete mongoose.models.InsightCache;
}

export default mongoose.models.InsightCache || mongoose.model('InsightCache', InsightCacheSchema);
