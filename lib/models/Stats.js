import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['admin', 'user'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'user';
    }
  },
  key: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  change: {
    type: String
  },
  changeType: {
    type: String,
    enum: ['positive', 'negative', 'neutral']
  },
  icon: {
    type: String
  },
  iconBg: {
    type: String
  },
  iconColor: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

StatsSchema.index({ type: 1, userId: 1, key: 1 });

export default mongoose.models.Stats || mongoose.model('Stats', StatsSchema);
