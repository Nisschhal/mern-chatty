import express from "express"
import {
  getAllContactsController,
  getChatPartnerController,
  getMessagesController,
  sendMessageController,
} from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// Get all contacts
router.get("/contacts", protectRoute, getAllContactsController)

// Get chat partner details
router.get("/chats", protectRoute, getChatPartnerController)

// Get messages with a specific contact
router.get("/:id", protectRoute, getMessagesController)

// Send a new message
router.post("/send/:id", protectRoute, sendMessageController)

export default router
