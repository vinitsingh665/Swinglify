import mongoose from 'mongoose';

const SearchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Automatically delete after 30 days (keep only fresh stats)
  }
});

export default mongoose.models.Search || mongoose.model('Search', SearchSchema);
