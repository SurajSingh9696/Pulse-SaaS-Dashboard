import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['usage', 'revenue', 'activity'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

AnalyticsSchema.index({ userId: 1, type: 1, date: 1 });

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
