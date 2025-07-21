const express = require('express');
const { body, validationResult } = require('express-validator');
const XLSX = require('xlsx');
const xss = require('xss');

const UserData = require('../models/UserData');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/data
 * @desc    Save user data (UID, password, 2FA key, email)
 * @access  Private
 */
router.post('/', [
  body('uid')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !/^61\d+$/.test(value)) {
        throw new Error('UID must start with 61 followed by digits');
      }
      return true;
    }),
  body('password')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Password cannot exceed 200 characters'),
  body('twoFaKey')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('2FA key cannot exceed 100 characters'),
  body('email')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new Error('Please enter a valid email address');
      }
      return true;
    }),
  body('date')
    .notEmpty()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      userId: req.user.id,
      uid: xss(req.body.uid || ''),
      password: xss(req.body.password || ''),
      twoFaKey: xss(req.body.twoFaKey || ''),
      email: xss(req.body.email || '').toLowerCase(),
      date: req.body.date
    };

    // Check if at least one field has data
    if (!sanitizedData.uid && !sanitizedData.password && !sanitizedData.twoFaKey && !sanitizedData.email) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (UID, password, 2FA key, or email) must be provided'
      });
    }

    // Create new data entry
    const userData = new UserData(sanitizedData);
    await userData.save();

    res.status(201).json({
      success: true,
      message: 'Data saved successfully',
      data: userData.getSanitizedData()
    });

  } catch (error) {
    console.error('Save data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save data'
    });
  }
});

/**
 * @route   GET /api/data
 * @desc    Get all user data grouped by date
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const groupedData = await UserData.getAllByUser(req.user.id);

    res.json({
      success: true,
      data: groupedData
    });

  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve data'
    });
  }
});

/**
 * @route   GET /api/data/:date
 * @desc    Get user data for a specific date
 * @access  Private
 */
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const data = await UserData.getByUserAndDate(req.user.id, date);

    res.json({
      success: true,
      data: data.map(item => item.getSanitizedData())
    });

  } catch (error) {
    console.error('Get data by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve data'
    });
  }
});

/**
 * @route   DELETE /api/data/:id
 * @desc    Delete a specific data entry
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedData = await UserData.deleteEntry(req.user.id, id);

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: 'Data entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Data entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete data entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete data entry'
    });
  }
});

/**
 * @route   DELETE /api/data/date/:date
 * @desc    Delete all data for a specific date
 * @access  Private
 */
router.delete('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const result = await UserData.deleteByUserAndDate(req.user.id, date);

    res.json({
      success: true,
      message: `${result.deletedCount} data entries deleted successfully`
    });

  } catch (error) {
    console.error('Delete data by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete data'
    });
  }
});

/**
 * @route   GET /api/data/export/txt
 * @desc    Export user data as text file
 * @access  Private
 */
router.get('/export/txt', async (req, res) => {
  try {
    const { date } = req.query;

    // Validate date if provided
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const data = await UserData.getForExport(req.user.id, date);

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found to export'
      });
    }

    // Generate text content
    let textContent = 'UID|Password|2FA Key|Email|Date|Created At\n';
    textContent += '=' .repeat(80) + '\n';
    
    data.forEach(item => {
      textContent += `${item.UID}|${item.Password}|${item['2FA Key']}|${item.Email}|${item.Date}|${item['Created At']}\n`;
    });

    // Set headers for file download
    const filename = date ? `dxz-data-${date}.txt` : `dxz-data-${new Date().toISOString().split('T')[0]}.txt`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(textContent);

  } catch (error) {
    console.error('Export TXT error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data as text file'
    });
  }
});

/**
 * @route   GET /api/data/export/xlsx
 * @desc    Export user data as Excel file
 * @access  Private
 */
router.get('/export/xlsx', async (req, res) => {
  try {
    const { date } = req.query;

    // Validate date if provided
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const data = await UserData.getForExport(req.user.id, date);

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found to export'
      });
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // UID
      { wch: 20 }, // Password
      { wch: 15 }, // 2FA Key
      { wch: 25 }, // Email
      { wch: 12 }, // Date
      { wch: 20 }  // Created At
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    const sheetName = date ? `Data ${date}` : 'DXZ Data';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    });

    // Set headers for file download
    const filename = date ? `dxz-data-${date}.xlsx` : `dxz-data-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(excelBuffer);

  } catch (error) {
    console.error('Export XLSX error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data as Excel file'
    });
  }
});

/**
 * @route   POST /api/data/extract-uid
 * @desc    Extract UID from Facebook URL
 * @access  Private
 */
router.post('/extract-uid', [
  body('input')
    .notEmpty()
    .withMessage('Input is required')
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { input } = req.body;
    let uid = null;

    // Check if input is already a UID (starts with 61 followed by digits)
    if (/^61\d+$/.test(input)) {
      uid = input;
    } else {
      // Try to extract UID from Facebook URL patterns
      const urlPatterns = [
        /(?:facebook\.com\/profile\.php\?id=)(\d+)/i,
        /(?:facebook\.com\/)([a-zA-Z0-9.]+)/i,
        /(?:fb\.com\/profile\.php\?id=)(\d+)/i,
        /(?:fb\.com\/)([a-zA-Z0-9.]+)/i,
        /(?:id=)(\d+)/i,
        /(\d{15,})/g // Look for long number sequences
      ];

      for (const pattern of urlPatterns) {
        const match = input.match(pattern);
        if (match && match[1]) {
          // Check if the extracted value looks like a Facebook UID
          if (/^\d{15,}$/.test(match[1])) {
            uid = match[1];
            break;
          }
        }
      }
    }

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract a valid UID from the provided input. Please ensure it\'s a valid Facebook URL or UID.'
      });
    }

    // Validate that the UID starts with 61 (Facebook UIDs typically start with 61)
    if (!uid.startsWith('61')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UID format. Facebook UIDs should start with 61.'
      });
    }

    res.json({
      success: true,
      message: 'UID extracted successfully',
      data: { uid }
    });

  } catch (error) {
    console.error('Extract UID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract UID'
    });
  }
});

/**
 * @route   GET /api/data/stats
 * @desc    Get user data statistics
 * @access  Private
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const allData = await UserData.find({ userId: req.user.id });

    const stats = {
      totalEntries: allData.length,
      entriesWithUID: allData.filter(item => item.uid).length,
      entriesWithPassword: allData.filter(item => item.password).length,
      entriesWithTwoFA: allData.filter(item => item.twoFaKey).length,
      entriesWithEmail: allData.filter(item => item.email).length,
      uniqueDates: [...new Set(allData.map(item => item.date))].length,
      oldestEntry: allData.length > 0 ? Math.min(...allData.map(item => new Date(item.createdAt))) : null,
      newestEntry: allData.length > 0 ? Math.max(...allData.map(item => new Date(item.createdAt))) : null
    };

    // Convert timestamps to dates
    if (stats.oldestEntry) {
      stats.oldestEntry = new Date(stats.oldestEntry).toISOString();
    }
    if (stats.newestEntry) {
      stats.newestEntry = new Date(stats.newestEntry).toISOString();
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
});

module.exports = router;