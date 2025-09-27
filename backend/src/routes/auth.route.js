import express from "express"
import {
  loginController,
  logoutController,
  signupController,
  updateProfileController,
} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// User Signup Route
router.post("/signup", signupController)

// Define your auth routes here
router.post("/login", loginController)

router.post("/logout", logoutController)

// Profile Update
router.put("/profile-update", protectRoute, updateProfileController)

// Check auth user
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user))

export default router
