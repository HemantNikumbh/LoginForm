import userModel from '../model/userModel.js';

export const getUserData = async(req,res) => {
    try {
        const { userId } = req.body;
        
        // Change from findById({userId}) to findById(userId)
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch(err) {
        console.error('Get user data error:', err);
        return res.status(500).json({
            success: false,
            message: "Error fetching user data"
        });
    }
}