import mongoose from "mongoose";
const uri = process.env.URI
const connectDB = async()=>{
    mongoose.connection.on('connected',()=>console.log("database connected"));
    await mongoose.connect(uri)
}

export default connectDB