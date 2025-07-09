const express = require('express');
const { authenticateToken } = require("../middleware/auth");
const databaseService = require('../services/database');
const router = express.Router();

// Public route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API working' });
});

// Protected routes
router.get('/profile', authenticateToken, (req, res) => {
  // Return user data from JWT token (no database query needed)
  res.json({
    message: 'Profile data retrieved successfully',
    user: {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role || 'user'
    }
  });
});

// Example: Create a new record
router.post('/create-record', authenticateToken, async (req, res) => {
  try {
    const { tableName, data } = req.body;
    
    // Add user_id to the data
    const recordData = {
      ...data,
      user_id: req.user.sub,
      created_at: new Date().toISOString()
    };

    const result = await databaseService.createRecord(tableName, recordData);

    if (result.success) {
      res.status(201).json({
        message: 'Record created successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        error: 'Failed to create record',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Create record route error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Example: Update a record
router.put('/update-record/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { tableName, updates } = req.body;

    const result = await databaseService.updateRecord(tableName, id, {
      ...updates,
      updated_at: new Date().toISOString()
    });

    if (result.success) {
      res.json({
        message: 'Record updated successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        error: 'Failed to update record',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Update record route error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Example: Delete a record
router.delete('/delete-record/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { tableName } = req.body;

    const result = await databaseService.deleteRecord(tableName, id);

    if (result.success) {
      res.json({
        message: 'Record deleted successfully'
      });
    } else {
      res.status(400).json({
        error: 'Failed to delete record',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Delete record route error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Example: Search records
router.get('/search/:tableName', authenticateToken, async (req, res) => {
  try {
    const { tableName } = req.params;
    const { column, term } = req.query;

    if (!column || !term) {
      return res.status(400).json({
        error: 'Search column and term are required'
      });
    }

    const result = await databaseService.searchRecords(tableName, column, term);

    if (result.success) {
      res.json({
        message: 'Search completed successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        error: 'Search failed',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/sports/names', authenticateToken, async (req, res) => {
  try {
    const result = await databaseService.getSportsName();
    if ( result.success ) {
      res.json({
        message: 'Sports name retrieved successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        error: 'Failed to retrieve sports name',
        details: result.error
      });
    }
  }catch (error) {
    console.error('Sports names route error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router;