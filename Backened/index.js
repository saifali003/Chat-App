import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";
dotenv.config();
const port = process.env.PORT || 8000;

app.use(express.json());
app.set("trust proxy", 1);
app.use(cors({
    origin : "https://chat-app-frontened-4evv.onrender.com",
    credentials : true
}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        message: "Backend Running",
        origin: req.headers.origin
    });
});

app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
app.use("/api/message",messageRouter);

server.listen(port,()=>{
    connectDB();
    console.log(`Server is running on port ${port}`);
})
