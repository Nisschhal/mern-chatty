import Message from "../models/message.model.js"
import User from "../models/user.model.js"

export const getAllContactsController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password")

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getChatPartnerController = (req, res) => {
  try {
    // Logic to fetch chat partner details
    res.status(200).json({ message: "Fetched chat partner details" })
  } catch (error) {
    console.error("Error fetching chat partner details:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getMessagesController = async (req, res) => {
  try {
    const { id } = req.params
    const loggedInUserId = req.user._id
    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: id },
        { sender: id, receiver: loggedInUserId },
      ],
    }) // Logic to fetch messages with a specific contact
    res.status(200).json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const sendMessageController = (req, res) => {
  try {
    // Logic to send a new message
    res.status(200).json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ message: "Server error" })
  }
}
