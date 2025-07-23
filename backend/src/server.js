import express from 'express';
import "dotenv/config";
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
const app = express();
const PORT=process.env.PORT 

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from "./routes/chat.route.js";


app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use('/api/auth',authRoutes );
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Ensure the database connection is established
});