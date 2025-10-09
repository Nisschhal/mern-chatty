import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { ENV } from "../lib/env.js"

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // 1. Extract token from socket cookie (FIXED: Proper chaining)
    const cookieHeader = socket.handshake.headers.cookie
    // console.log("Full Cookie Header:", cookieHeader) // ADD: Debug full header

    if (!cookieHeader) {
      return next(new Error("Authentication error: No cookies provided"))
    }

    const tokenRow = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("jwt="))
    if (!tokenRow) {
      return next(new Error("Authentication error: No JWT cookie found"))
    }

    const token = tokenRow.split("=")[1] // Extract value after =
    // console.log("Extracted Token:", token) // ADD: Confirm it's the JWT string

    if (!token) {
      return next(new Error("Authentication error: Invalid token format"))
    }

    // 2. Verify Token (FIXED: No extra split—token is already the value)
    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    if (!decoded) {
      return next(new Error("Authentication error: Invalid token"))
    }

    // 3. Find User by ID
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return next(new Error("Authentication error: User not found"))
    }

    // 4. Attach user info to socket object
    socket.user = user
    socket.userId = user._id.toString()

    console.log(
      `User ${user.fullName} with ID ${user._id} connected via socket.`
    )
    // console.log("Socket User Object:", socket.user)

    // 5. Proceed to next middleware
    next()
  } catch (error) {
    console.error("Socket authentication error:", error)
    next(new Error("Unauthorized: Authentication failed"))
  }
}
