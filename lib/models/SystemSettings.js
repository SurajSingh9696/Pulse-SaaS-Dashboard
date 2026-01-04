import mongoose from 'mongoose';

const SystemSettingsSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  registrationPaused: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.SystemSettings || mongoose.model('SystemSettings', SystemSettingsSchema);
