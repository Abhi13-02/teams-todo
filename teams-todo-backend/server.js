import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

const port = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing url encoded data i.e form data
app.use(cookieParser());

// Enable CORS (IMPORTANT for frontend to connect)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
