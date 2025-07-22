import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI) 
    console.log(`MongoDB connected: ${conn.connection.host}`); // Log the host of the connected MongoDB instance
             
    }
        
     catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}