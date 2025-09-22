import express from "express"
import { signupController } from "../controllers/auth.controller.js"

const router = express.Router()

// User Signup Route
router.post("/signup", signupController)

// Define your auth routes here
router.post("/login", (req, res) => {
  // Handle login
  res.send("Login route")
})

router.post("/logout", (req, res) => {
  // Handle logout
  res.send("Logout route")
})

export default router
