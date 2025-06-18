import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from '../model/userModel.js';
import transport from "../config/nodemailer.js";
// ...existing code...


export const register = async(req,res) =>{
    const{name,email,password}=req.body

    if(!name||!email||!password){
        return res.json({success:false,message:"missing detail"})
    }
    try{
        const existuser = await userModel.findOne({email})
        if(existuser){
            return res.json({success:false,message:"user already exist"})
        }

        const hashpassword = await bcrypt.hash(password,10)

        const user = new userModel({name,email,password:hashpassword})

        await user.save();

        const token = jwt.sign({id:user._id},process.env.Key,{expiresIn:'7d'})

        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.node_env==="production",
            sameSite:process.env.node_env==="production"?"none":"strict",
            maxAge: 7*24*60*60*1000,

        })
        // sending welcome email

        const mailOption = {
            from:process.env.send,
            to:email,
            subject:"wellcome to hemant",
            text:`your acoount has been created : ${email}`

        }
        await transport.sendMail(mailOption)

        return res.json({success:true})
        

    }catch(err){
        console.log(err)
    }
}

export const login = async(req,res)=>{
    const{email,password} = req.body
    if(!email||!password){
        return res.json({success:false,message:"email and password are require"})

    }
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"invalid email"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.json({success:false,message:"invalid pass"})
        }

         const token = jwt.sign({id:user._id},process.env.Key,{expiresIn:'7d'})

        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.node_env==="production",
            sameSite:process.env.node_env==="production"?"none":"strict",
            maxAge: 7*24*60*60*1000,

        })

        return res.json({success:true})

    }catch(err){
        console.log(err)``
    }
}


export const logout = async(req,res) =>{
    try{
        res.clearCookie("token",{
             httpOnly:true,
            secure:process.env.node_env==="production",
            sameSite:process.env.node_env==="production"?"none":"strict",
            maxAge: 7*24*60*60*1000,

        })
        return res.json({success:true,message:"logout"})

    }catch(err){
        console.log(err)
    }
}

// Send verification otp to the user otp
export const sentVerifyOtp = async(req,res) =>{
    try{
        const {userId} = req.body
        const user = await userModel.findById(userId)
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account already verified"})
        }
        const Otp = String(Math.floor(100000*Math.random()*900000))

        user.verifyOtp = Otp

        user.verifyOtpExpireAt=Date.now()+24*60*60*1000

        await user.save()

        const mailOption = {
            from:process.env.send,
            to:user.email,
            subject:"Account Verification Otp",
            text:`Your OTP is ${Otp}. Verify your account using this OTP.`
        }
        await transport.sendMail(mailOption)

        res.json({success:true,message:"Verification OTP Sent on Email"})

    }catch(err){
        console.log(err)
    }
}

export const verifyEmail = async(req,res)=>{
    const {userId,Otp} = req.body

    if(!userId || !Otp){
        return res.json({success:false,message:"Missing Details"})
    }
    try{
        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        if(user.verifyOtp===''||user.verifyOtp!==Otp){
            return res.json({success:false,message:"invalid otp"})
        }
        if(user.verifyOtpExpireAt<Date.now()){
           return res.json({success:false,message:"Otp Already Expire"})
        }
        user.isAccountVerified = true
        user.verifyOtp=""
        user.verifyOtpExpireAt=0

        await user.save()

        return res.json({success:true,message:"Email verified Successfully"})

    }catch(err){
        console.log(err)
    }

}

// check uer is Authenticated or not
export const isAuthenticated = async(req,res)=>{
    try{
        return res.json({success:true})

    }catch(err){{
        console.log(err)
    }}
    
}

//Send password Reset Otp
export const sendResetOtp = async(req,res) =>{
    const {email}=req.body
    if(!email){
        return res.json({success:false,message:"email is required"})
    }
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        const Otp = String(Math.floor(100000*Math.random()*900000))

        user.resetOtp = Otp

        user.resetOtpExpireAt=Date.now()+15*60*1000

        await user.save()

        const mailOption = {
            from:process.env.send,
            to:user.email,
            subject:"Password Reset Otp",
            text:`Your OTP for reseting your password is ${Otp}, use this otp to proceed with resetting your response.`
        }
        await transport.sendMail(mailOption)
        return res.json({success:true,message:"otp is send your email address"})


    }catch(err){
        console.log(err)
    }
}

//reset user password

export const restPassword = async(req,res)=>{
    const {email,Otp,newPassword} = req.body
    if(!email||!Otp||!newPassword){
        return res.json({success:false,message:"Email,OTP,Password are required"})
    }
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        if(user.resetOtp===""||user.resetOtp!==Otp){
            return res.json({success:false,message:"invalid otp"})
        }
        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false,message:"Otp Expired"})
        }
        const hashpassword = await bcrypt.hash(newPassword,10)

        user.password = hashpassword;
        user.resetOtp = ""
        user.resetOtpExpireAt=0
        
        await user.save()

        return res.json({success:true,message:"Reset Password SuccessFully"})

    }catch(err){
        console.log(err)
    }
}