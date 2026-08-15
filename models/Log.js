import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  query: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  result: {
    success: Boolean,
    message: String,
    raw: mongoose.Schema.Types.Mixed
  }
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
