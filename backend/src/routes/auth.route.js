import express from "express"
import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/auth.controller.js"

const router = express.Router()

// User Signup Route
router.post("/signup", signupController)

// Define your auth routes here
router.post("/login", loginController)

router.post("/logout", logoutController)

export default router
