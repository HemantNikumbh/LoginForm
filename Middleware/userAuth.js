import jwt from "jsonwebtoken"

const userAuth = async(req, res, next) => {
    try {
        const { token } = req.cookies
        
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized - No token provided"
            })
        }
        
        const decoded = jwt.verify(token, process.env.KEY)
        if(!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        
        // Initialize req.body if it doesn't exist
        req.body = req.body || {}
        req.body.userId = decoded.id
        
        next()
    } catch(err) {
        console.error('Auth middleware error:', err)
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        })
    }
}

export default userAuth