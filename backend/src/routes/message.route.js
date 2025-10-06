import express from "express"
import {
  getAllContactsController,
  getChatPartnerController,
  getMessagesController,
  sendMessageController,
} from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjectProtection } from "../middleware/arcjet.middleware.js"

const router = express.Router()

// Apply Arcjet protection middleware for rate limiting and security and then apply authentication middleware
// Apply protection middleware to all routes in this router
// This ensures that only authenticated users can access these routes

router.use(arcjectProtection, protectRoute)

// Get all contacts
router.get("/contacts", getAllContactsController)

// Get chat partner details
router.get("/chats", getChatPartnerController)

// Get messages with a specific contact
router.get("/:id", getMessagesController)

// Send a new message
router.post("/send/:id", sendMessageController)

export default router
