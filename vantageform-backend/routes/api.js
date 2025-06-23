import express from 'express'
import { autheticateToken } from "../middleware/auth"

const router = express.Router()

//Public route
router.get('health', (req,res) => {
    res.json({status: 'OK', message: 'API working'})
})

//Protected routes
router.get('/profile', autheticateToken, (req, res) => {
    res.json({
        message: 'Protected profile data',
        user: {
            id: req.user.sub,
            email: req.user.email,
            role: req.user.role
        }
    })
})

router.get('/dashboard-data', autheticateToken, (req, res) => {
    res.json({
        data: 'This is protected dashboard data',
        userId: req.user.sub,
        timestamp: new Date().toISOString()
    })
})

export default router