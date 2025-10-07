import express from "express"
import dotenv from "dotenv"
import path from "path"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import ENV from "./lib/env.js"

dotenv.config()

const app = express()

// Middlewares
// Parse JSON bodies  (as sent by API clients)
app.use(express.json({ limit: "10mb" })) // NEW: Bump from default 1mb// Parse Cookie for JWT token
app.use(cookieParser())
// Enable CORS for cross-origin requests
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["http://localhost:5173", "http://localhost:3000"] // Allow both
        : ENV.CLIENT_URL,
    credentials: true,
  })
)
const PORT = process.env.PORT || 3000
console.log("PORT:", PORT)

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

// Deployment Setup for Production
// Serve static files from the React frontend app
// Get the absolute path to the 'frontend/dist' directory
/**
 * Note: __dirname is not available in ES modules, so we use path.resolve() to get the current directory
 * 1. Get the current directory using path.resolve()
 * 2. Join the current directory with 'frontend/dist' to get the absolute path
 * 3. Serve static files from the 'frontend/dist' directory, meaning tell express to serve the files in that directory
 * 4. For any route that is not an API route, send the index.html file from the 'frontend/dist' directory
 *    This is important for React Router to work properly in production
 */

const __dirname = path.resolve()
const frontendDistPath = path.join(__dirname, "..", "frontend", "dist")

console.log("Frontend Dist Path:", frontendDistPath)
console.log(process.env.NODE_ENV)

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(frontendDistPath)))

  app.use(/(.*)/, (_, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})
