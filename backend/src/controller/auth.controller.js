
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { upsertStreamUser } from '../lib/stream.js';
export async function signup(req, res) {
    const { email, password, fullname } = req.body;
    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });

        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {

            return res.status(400).json({ message: 'Please enter a valid email address' });
        }



        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists,please use different email' });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/410/${idx}.png`;
        const newUser = new User({
            fullname,
            email,
            password,
            profilePicture: randomAvatar, // Assigning a random avatar

        });

        try {

            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePicture || "",

            });

            console.log(`Stream user created: ${newUser.fullname}`); // Log the Stream user creation
        }
        catch (error) {
            console.error('Error creating/updating Stream user:', error);
        }



        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });
        res.status(201).json({ sucess: true, message: 'User created successfully', user: newUser });

    }

    catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });

        }
        const isCorrectPassword = await user.matchPassword(password);
        if (!isCorrectPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });
        res.status(200).json({ sucess: true, user });


    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }
}
export function logout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Logged out successfully' });
}

export async function onboard(req,res){
    try {
    const userId = req.user._id;

    const { fullname, bio, branch, college,yearOfStudy  } = req.body;

    if (!fullname || !bio || !branch || !college || !yearOfStudy) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullname && "fullName",
          !bio && "bio",
          !branch && "branch",
          !college  && "college",
          !yearOfStudy && "yearOfStudy",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}