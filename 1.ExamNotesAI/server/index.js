import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connectDb from "./utils/connectDB.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/generate.route.js"
import pdfRouter from "./routes/pdf.route.js";
import paymentRouter from "./routes/credits.route.js";

import adminRouter from "./routes/admin.route.js";

const app = express()
const PORT = process.env.PORT || 8000


app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://examnotes-backend-vjow.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


app.get("/",(req,res)=>{
    res.json({message:"ExamNotes AI Backend Running 🚀"})

})

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);

app.use("/api/notes", notesRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/payment", paymentRouter);

app.use("/api/admin", adminRouter);


app.listen(PORT,()=>{

    console.log(`✅ Server running on port ${PORT}`)
    connectDb();

})