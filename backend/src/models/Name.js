const mongoose = require('mongoose');

/**
 * Name Schema for DXZ Data Manager
 * Stores the dataset of Indian names for the random name generator
 */
const nameSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true,
    maxlength: [50, 'Surname cannot exceed 50 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female'],
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'names'
});

// Compound unique index to prevent duplicate first name + surname combinations within same gender
nameSchema.index({ firstName: 1, surname: 1, gender: 1 }, { unique: true });

// Index for efficient gender-based queries
nameSchema.index({ gender: 1, isActive: 1 });

/**
 * Static method to get random names by gender
 */
nameSchema.statics.getRandomNames = async function(gender, count = 5) {
  try {
    const names = await this.aggregate([
      { $match: { gender: gender.toLowerCase(), isActive: true } },
      { $sample: { size: count } }
    ]);
    
    return names.map(name => ({
      id: name._id,
      firstName: name.firstName,
      surname: name.surname,
      fullName: `${name.firstName} ${name.surname}`,
      gender: name.gender
    }));
  } catch (error) {
    throw new Error(`Failed to fetch random ${gender} names: ${error.message}`);
  }
};

/**
 * Static method to get names count by gender
 */
nameSchema.statics.getCountByGender = async function(gender) {
  return await this.countDocuments({ gender: gender.toLowerCase(), isActive: true });
};

/**
 * Static method to check if name combination exists
 */
nameSchema.statics.checkDuplicate = async function(firstName, surname, gender) {
  const existing = await this.findOne({
    firstName: firstName.trim(),
    surname: surname.trim(),
    gender: gender.toLowerCase()
  });
  
  return !!existing;
};

/**
 * Static method to bulk insert names (for initial data seeding)
 */
nameSchema.statics.bulkInsertNames = async function(namesArray) {
  try {
    // Remove duplicates within the array itself
    const uniqueNames = namesArray.filter((name, index, self) => 
      index === self.findIndex(n => 
        n.firstName === name.firstName && 
        n.surname === name.surname && 
        n.gender === name.gender
      )
    );
    
    // Insert with ordered: false to continue on duplicate key errors
    const result = await this.insertMany(uniqueNames, { 
      ordered: false,
      rawResult: true 
    });
    
    return {
      inserted: result.insertedCount || 0,
      duplicates: uniqueNames.length - (result.insertedCount || 0)
    };
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const inserted = error.result ? error.result.insertedCount : 0;
      return {
        inserted,
        duplicates: namesArray.length - inserted,
        message: 'Some names were duplicates and were skipped'
      };
    }
    throw error;
  }
};

/**
 * Static method to get all names by gender (for admin purposes)
 */
nameSchema.statics.getAllByGender = async function(gender, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const names = await this.find({ 
    gender: gender.toLowerCase(), 
    isActive: true 
  })
  .sort({ firstName: 1, surname: 1 })
  .skip(skip)
  .limit(limit);
  
  const total = await this.countDocuments({ 
    gender: gender.toLowerCase(), 
    isActive: true 
  });
  
  return {
    names,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Instance method to get formatted full name
 */
nameSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.surname}`;
};

/**
 * Instance method to generate password format for this name
 */
nameSchema.methods.generatePassword = function(username) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.getDate().toString().padStart(2, '0');
  
  return `${username}${this.firstName}@${tomorrowDate}`;
};

module.exports = mongoose.model('Name', nameSchema);