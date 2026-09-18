const express = require('express');
const Community = require('../models/Community');

const router = express.Router();

// GET /api/communities
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = {};

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const communities = await Community.find(query)
      .populate('members', 'username firstName lastName profilePicture')
      .sort({ memberCount: -1, createdAt: -1 });

    res.json({
      success: true,
      data: communities
    });
  } catch (error) {
    console.error('Get communities error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching communities'
    });
  }
});

// GET /api/communities/:id
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members', 'username firstName lastName profilePicture');
    
    if (!community) {
      return res.status(404).json({
        success: false,
        error: 'Community not found'
      });
    }

    res.json({
      success: true,
      data: community
    });
  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching community'
    });
  }
});

module.exports = router; 