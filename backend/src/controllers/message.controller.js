import cloudinary from "../lib/cloudinary.js"
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

export const getChatPartnersController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    })

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ]

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password")

    res.status(200).json(chatPartners)
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getMessagesController = async (req, res) => {
  try {
    console.log("Getting messages for contact ID:", req.params)
    const { id } = req.params
    const loggedInUserId = req.user._id
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: id },
        { senderId: id, receiverId: loggedInUserId },
      ],
    }) // Logic to fetch messages with a specific contact
    res.status(200).json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const sendMessageController = async (req, res) => {
  try {
    console.log("Request Body:", req.body)
    const { text, image } = req.body
    const senderId = req.user._id
    const { id: receiverId } = req.params
    console.log("Sending message from:", senderId, "to:", receiverId)

    // upload to cloudinary if image is present
    let imageUrl = ""
    if (image) {
      // upload to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image)
      // get the url
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    await newMessage.save()
    // Logic to send a new message
    // Todo: Emit socket event for real-time updates

    res.status(200).json(newMessage)
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ message: "Server error" })
  }
}
