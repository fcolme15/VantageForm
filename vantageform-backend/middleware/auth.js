import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, nextt) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({error: 'Access token required'})
    }

    try {
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (e) {
        return res.status(403).json({error: 'Invalid token'})
    }

}