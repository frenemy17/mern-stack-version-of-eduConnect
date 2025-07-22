import express from 'express';
import "dotenv/config";
import {connectDB} from './lib/db.js';
const app = express();
const PORT=process.env.PORT 

import authRoutes from './routes/auth.routes.js';
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/auth',authRoutes );
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Ensure the database connection is established
});