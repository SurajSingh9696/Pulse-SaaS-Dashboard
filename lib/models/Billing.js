import mongoose from 'mongoose';

const BillingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['Free Tier', 'Pro Plan', 'Enterprise'],
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'past_due', 'trialing'],
    default: 'active'
  },
  currentPeriodStart: {
    type: Date,
    required: true
  },
  currentPeriodEnd: {
    type: Date,
    required: true
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  lastPaymentDate: Date,
  nextPaymentDate: Date
}, {
  timestamps: true
});

export default mongoose.models.Billing || mongoose.model('Billing', BillingSchema);
