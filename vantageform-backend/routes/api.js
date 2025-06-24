const express = require('express');
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

//Public route
router.get('/health', (req,res) => {
    res.json({status: 'OK', message: 'API working'});
});

//Protected routes
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'Protected profile data',
        user: {
            id: req.user.sub,
            email: req.user.email,
            role: req.user.role
        }
    });
});

router.get('/dashboard-data', authenticateToken, (req, res) => {
    res.json({
        data: 'This is protected dashboard data',
        userId: req.user.sub,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;