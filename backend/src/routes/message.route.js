import express from "express"

const router = express.Router()

// Define your message routes here
router.get("/get", (req, res) => {
  // Handle fetching messages
  res.send("Get messages route")
})

router.get("/send", (req, res) => {
  // Handle sending a new message
  res.send("Send message route")
})

export default router
