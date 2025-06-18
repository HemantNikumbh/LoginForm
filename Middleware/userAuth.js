import jwt from "jsonwebtoken"

const userAuth = async(req, res, next) => {
    const {token} = req.cookies
    
    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized"
        })
    }
    
    try {
        const tokenDecoded = jwt.verify(token, process.env.Key)
        
        if(!tokenDecoded.id) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again"
            })
        }
        
        req.body.userId = tokenDecoded.id
        next()
    } catch(err) {
        console.error('Auth Error:', err)
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}

export default userAuth