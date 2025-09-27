import jwt from "jsonwebtoken"
import { ENV } from "../lib/env.js"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    console.log("JWT Token from Cookie:", token)
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" })

    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    console.log("JWT Decoded:", decoded)
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid token" })
    console.log("Decoded JWT:", decoded)

    // Fetch the user from the database

    const user = await User.findById(decoded.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    req.user = user
    next()
  } catch (error) {
    console.log("Error in protectRoute middleware:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
