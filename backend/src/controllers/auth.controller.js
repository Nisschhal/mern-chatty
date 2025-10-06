import bcrypt from "bcryptjs"
import User from "../models/user.model.js"

import { generateToken } from "../lib/utils.js"
import { sendEmail } from "../lib/email.js"
import ENV from "../lib/env.js"
import cloudinary from "../lib/cloudinary.js"

export const signupController = async (req, res) => {
  const { fullName, email, password } = req.body
  const { CLIENT_URL } = ENV
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" })
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address!" })
    }

    // hash the password before saving to database (for security)
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Hashed Password:", hashedPassword)

    // check if user already exists in the database
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" })
    }

    // Create a new user object
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    console.log("Creating new user:", newUser)

    if (!newUser) {
      return res.status(500).json({ error: "Could not create user" })
    }

    // Save the new user to the database
    const savedUser = await newUser.save()

    // Generate a token for the new user
    generateToken(savedUser._id, res)
    console.log("User created successfully:", newUser)

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser })

    // TODO: send verification || welcome email
    try {
      await sendEmail(email, fullName, process.env.CLIENT_URL)
    } catch (error) {
      console.error("Error sending welcome email:", error)
    }
  } catch (error) {
    console.error("Error creating user:", error)
    res
      .status(500)
      .json({ error: "Internal server error, Could not create user" })
  }
}

export const loginController = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Check if user exists in the database
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate a token for the user
    generateToken(user._id, res)
    const { password: pwd, ...userWithoutPassword } = user.toObject()
    res.json({ message: "Login successful", user: userWithoutPassword })
  } catch (error) {
    console.error("Error logging in user:", error)
    res
      .status(500)
      .json({ error: "Internal server error, Could not log in user" })
  }
}

export const logoutController = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 })
  res.status(200).json({ message: "Logged out successfully" })
}

// Profile Update
export const updateProfileController = async (req, res) => {
  try {
    const { profilePic } = req.body
    if (!profilePic) {
      return res.status(400).json({ error: "Profile picture is required" })
    }

    const userId = req.user._id
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    )
    res.status(200).json({ message: "User Profile Updated!", updatedUser })
  } catch (error) {
    console.error("Error updating profile:", error)
    res
      .status(500)
      .json({ error: "Internal server error, Could not update profile" })
  }
}
