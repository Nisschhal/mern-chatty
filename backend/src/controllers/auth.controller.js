import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"

export const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
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
      return res.status(400).json({ error: "User already exists" })
    }

    // Create a new user object
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })
    console.log("Creating new user:", newUser)

    if (!newUser) {
      return res.status(500).json({ error: "Could not create user" })
    }
    // Save the new user to the database
    generateToken(newUser._id, res)
    await newUser.save()
    console.log("User created successfully:", newUser)

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser })

    // TODO: send verification || welcome email
  } catch (error) {
    console.error("Error creating user:", error)
    res
      .status(500)
      .json({ error: "Internal server error, Could not create user" })
  }
}

export const loginController = (req, res) => {
  // Handle user login logic here
  res.send("Login route")
}

export const logoutController = (req, res) => {
  // Handle user logout logic here
  res.send("Logout route")
}
