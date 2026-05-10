import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connectDb from "./utils/connectDB.js";

const app = express()
const PORT = process.env.PORT || 5000
app.get("/",(req,res)=>{
    res.json({message:"ExamNotes AI Backend Running 🚀"})

})
app.listen(PORT,()=>{

    console.log(`✅ Server running on port ${PORT}`)
    connectDb();

})