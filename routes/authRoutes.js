import express from 'express'
import { isAuthenticated, login, logout, register, restPassword, sendResetOtp, sentVerifyOtp, verifyEmail } from '../controller/authcontroller.js'
import userAuth from '../Middleware/userAuth.js'

export const authRouter = express.Router()



// Route handlers with input validation
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp',  userAuth, sentVerifyOtp)
authRouter.post('/verify-account',  userAuth, verifyEmail)
authRouter.post('/is-auth',  userAuth, isAuthenticated)
authRouter.post('/sendResetOtp',sendResetOtp)
authRouter.post('/ResetPassword',restPassword)