import jwt from "jsonwebtoken"
import ENV from "./env.js"

export const generateToken = async (userId, res) => {
  try {
    const { JWT_SECRET, NODE_ENV } = ENV

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }

    // Function to generate a token (e.g., JWT) for the user
    const token = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: "1d", // Token validity duration
    })
    // place the token in an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // Use secure cookies in production
      sameSite: "Strict", // Adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    })
    return token
  } catch (error) {
    console.error("Error generating token:", error)
    throw new Error("Token generation failed")
  }
}
