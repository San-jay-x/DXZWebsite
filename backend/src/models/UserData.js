const mongoose = require('mongoose');

/**
 * UserData Schema for DXZ Data Manager
 * Stores user-specific data including passwords, UIDs, 2FA keys, and emails
 */
const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  uid: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        // Allow empty string or valid UID format (starts with 61 followed by digits)
        return v === '' || /^61\d+$/.test(v);
      },
      message: 'UID must start with 61 followed by digits or be empty'
    }
  },
  password: {
    type: String,
    trim: true,
    default: '',
    maxlength: [200, 'Password cannot exceed 200 characters']
  },
  twoFaKey: {
    type: String,
    trim: true,
    default: '',
    maxlength: [100, '2FA key cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
    validate: {
      validator: function(v) {
        // Allow empty string or valid email format
        return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address or leave empty'
    }
  },
  date: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'userdata'
});

// Compound index for efficient queries
userDataSchema.index({ userId: 1, date: -1 });
userDataSchema.index({ userId: 1, createdAt: -1 });

/**
 * Pre-save middleware to update the updatedAt field
 */
userDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Static method to get user data by date
 */
userDataSchema.statics.getByUserAndDate = async function(userId, date) {
  return await this.find({ userId, date }).sort({ createdAt: -1 });
};

/**
 * Static method to get all user data grouped by date
 */
userDataSchema.statics.getAllByUser = async function(userId) {
  const data = await this.find({ userId }).sort({ date: -1, createdAt: -1 });
  
  // Group by date
  const groupedData = {};
  data.forEach(item => {
    if (!groupedData[item.date]) {
      groupedData[item.date] = [];
    }
    groupedData[item.date].push({
      id: item._id,
      uid: item.uid,
      password: item.password,
      twoFaKey: item.twoFaKey,
      email: item.email,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  });
  
  return groupedData;
};

/**
 * Static method to delete all data for a specific date
 */
userDataSchema.statics.deleteByUserAndDate = async function(userId, date) {
  return await this.deleteMany({ userId, date });
};

/**
 * Static method to delete a specific entry
 */
userDataSchema.statics.deleteEntry = async function(userId, entryId) {
  return await this.findOneAndDelete({ _id: entryId, userId });
};

/**
 * Static method to get data for export (formatted for files)
 */
userDataSchema.statics.getForExport = async function(userId, date = null) {
  const query = { userId };
  if (date) {
    query.date = date;
  }
  
  const data = await this.find(query).sort({ date: -1, createdAt: -1 });
  
  return data.map(item => ({
    UID: item.uid || '',
    Password: item.password || '',
    '2FA Key': item.twoFaKey || '',
    Email: item.email || '',
    Date: item.date,
    'Created At': item.createdAt.toISOString()
  }));
};

/**
 * Method to get formatted data string for text export
 */
userDataSchema.methods.getFormattedString = function() {
  return `${this.uid || ''}|${this.password || ''}|${this.twoFaKey || ''}|${this.email || ''}`;
};

/**
 * Method to validate if entry has any meaningful data
 */
userDataSchema.methods.hasData = function() {
  return this.uid || this.password || this.twoFaKey || this.email;
};

/**
 * Instance method to get sanitized data (for API responses)
 */
userDataSchema.methods.getSanitizedData = function() {
  return {
    id: this._id,
    uid: this.uid,
    password: this.password,
    twoFaKey: this.twoFaKey,
    email: this.email,
    date: this.date,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('UserData', userDataSchema);