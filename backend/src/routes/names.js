const express = require('express');
const { body, validationResult } = require('express-validator');

const Name = require('../models/Name');
const { authenticate } = require('../middleware/auth');
const { getAllNamesFlat, validateDataset } = require('../data/indianNames');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/names/:gender
 * @desc    Get random names by gender with generated passwords
 * @access  Private
 */
router.get('/:gender', async (req, res) => {
  try {
    const { gender } = req.params;
    const count = parseInt(req.query.count) || 5;

    // Validate gender
    if (!['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be either "male" or "female"'
      });
    }

    // Validate count
    if (count < 1 || count > 20) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 1 and 20'
      });
    }

    // Get random names
    const names = await Name.getRandomNames(gender.toLowerCase(), count);

    if (names.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${gender} names found in the database`
      });
    }

    // Generate passwords for each name
    const namesWithPasswords = names.map(name => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.getDate().toString().padStart(2, '0');
      
      const password = `${req.user.username}${name.firstName}@${tomorrowDate}`;
      
      return {
        id: name.id,
        firstName: name.firstName,
        surname: name.surname,
        fullName: name.fullName,
        password: password,
        gender: name.gender
      };
    });

    res.json({
      success: true,
      data: {
        names: namesWithPasswords,
        username: req.user.username,
        count: namesWithPasswords.length,
        gender: gender.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Get random names error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve random names'
    });
  }
});

/**
 * @route   GET /api/names/stats/:gender
 * @desc    Get statistics for names by gender
 * @access  Private
 */
router.get('/stats/:gender', async (req, res) => {
  try {
    const { gender } = req.params;

    // Validate gender
    if (!['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be either "male" or "female"'
      });
    }

    const count = await Name.getCountByGender(gender.toLowerCase());

    res.json({
      success: true,
      data: {
        gender: gender.toLowerCase(),
        totalNames: count,
        isComplete: count >= 500
      }
    });

  } catch (error) {
    console.error('Get name stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve name statistics'
    });
  }
});

/**
 * @route   GET /api/names/stats/overview
 * @desc    Get overall statistics for the names database
 * @access  Private
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const maleCount = await Name.getCountByGender('male');
    const femaleCount = await Name.getCountByGender('female');
    const totalCount = maleCount + femaleCount;

    // Validate the dataset
    const validation = validateDataset();

    res.json({
      success: true,
      data: {
        totalNames: totalCount,
        maleNames: maleCount,
        femaleNames: femaleCount,
        isComplete: maleCount >= 500 && femaleCount >= 500,
        validation: {
          isValid: validation.isValid,
          expectedTotal: 1000,
          actualTotal: validation.totalCount,
          maleUniqueFirstNames: validation.maleUniqueFirstNames,
          femaleUniqueFirstNames: validation.femaleUniqueFirstNames,
          maleUniqueSurnames: validation.maleUniqueSurnames,
          femaleUniqueSurnames: validation.femaleUniqueSurnames
        }
      }
    });

  } catch (error) {
    console.error('Get names overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve names overview'
    });
  }
});

/**
 * @route   POST /api/names/seed
 * @desc    Seed the database with Indian names (Admin only - for development)
 * @access  Private
 */
router.post('/seed', async (req, res) => {
  try {
    // Check if database already has names
    const existingCount = await Name.countDocuments();
    
    if (existingCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Database already contains ${existingCount} names. Clear the database first if you want to re-seed.`
      });
    }

    // Get all names from the dataset
    const allNames = getAllNamesFlat();
    
    // Bulk insert names
    const result = await Name.bulkInsertNames(allNames);

    res.json({
      success: true,
      message: 'Names database seeded successfully',
      data: {
        inserted: result.inserted,
        duplicates: result.duplicates || 0,
        total: allNames.length
      }
    });

  } catch (error) {
    console.error('Seed names error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed names database'
    });
  }
});

/**
 * @route   DELETE /api/names/clear
 * @desc    Clear all names from the database (Admin only - for development)
 * @access  Private
 */
router.delete('/clear', async (req, res) => {
  try {
    const result = await Name.deleteMany({});

    res.json({
      success: true,
      message: 'Names database cleared successfully',
      data: {
        deletedCount: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Clear names error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear names database'
    });
  }
});

/**
 * @route   POST /api/names/validate
 * @desc    Validate the names dataset
 * @access  Private
 */
router.post('/validate', async (req, res) => {
  try {
    // Get validation from the dataset
    const datasetValidation = validateDataset();
    
    // Get database counts
    const maleCount = await Name.getCountByGender('male');
    const femaleCount = await Name.getCountByGender('female');
    
    // Check for duplicates in database
    const duplicates = await Name.aggregate([
      {
        $group: {
          _id: { firstName: '$firstName', surname: '$surname', gender: '$gender' },
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    const validation = {
      dataset: datasetValidation,
      database: {
        maleCount,
        femaleCount,
        totalCount: maleCount + femaleCount,
        duplicatesFound: duplicates.length,
        duplicates: duplicates.slice(0, 10) // Show first 10 duplicates
      },
      isComplete: maleCount >= 500 && femaleCount >= 500,
      needsSeeding: maleCount === 0 && femaleCount === 0
    };

    res.json({
      success: true,
      data: validation
    });

  } catch (error) {
    console.error('Validate names error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate names database'
    });
  }
});

/**
 * @route   GET /api/names/search/:gender
 * @desc    Search names by first name or surname
 * @access  Private
 */
router.get('/search/:gender', async (req, res) => {
  try {
    const { gender } = req.params;
    const { q, page = 1, limit = 20 } = req.query;

    // Validate gender
    if (!['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be either "male" or "female"'
      });
    }

    // Validate search query
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchQuery = q.trim();
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Create search filter
    const filter = {
      gender: gender.toLowerCase(),
      isActive: true,
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { surname: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    // Get matching names
    const names = await Name.find(filter)
      .sort({ firstName: 1, surname: 1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Name.countDocuments(filter);

    // Format results with passwords
    const resultsWithPasswords = names.map(name => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.getDate().toString().padStart(2, '0');
      
      const password = `${req.user.username}${name.firstName}@${tomorrowDate}`;
      
      return {
        id: name._id,
        firstName: name.firstName,
        surname: name.surname,
        fullName: `${name.firstName} ${name.surname}`,
        password: password,
        gender: name.gender
      };
    });

    res.json({
      success: true,
      data: {
        names: resultsWithPasswords,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        query: searchQuery,
        gender: gender.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Search names error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search names'
    });
  }
});

module.exports = router;