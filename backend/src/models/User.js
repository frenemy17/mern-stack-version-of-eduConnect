import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String, 
        default: "", // Placeholder URL for profile picture  
    },
    yearOfStudy: {
        type: String,
        default: "",
    },
    branch: {
        type: String,   
        default: "", // Optional field

    },
    college: {
        type: String,
        default: "", // Optional field
    },
    isOnboarded: {
        type: Boolean,
        default: false, // Indicates if the user has completed onboarding
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model for friends
    }],

}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    }
    catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect= await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
}


const User = mongoose.model("User", userSchema);



export default User;