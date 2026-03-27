import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  // ─── Onboarding fields ───
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    trim: true
  },
  profilePic: {
    type: String  // base64 or URL for custom profile picture
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  // ─── Synced Data ───
  watchlist: {
    type: [String],
    default: []
  },
  portfolio: {
    type: Array, // Flexible array of holding objects
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
