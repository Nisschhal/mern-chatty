import { Server } from "socket.io"
import http from "http"
import express from "express"

import { ENV } from "./env.js"
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js"

const app = express()
const server = http.createServer(app)

// In lib/socket.js
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:5173", "http://localhost:3000"]
        : ENV.CLIENT_URL, // FIXED: Use CLIENT_URL consistently
    credentials: true,
  },
})
// socket auth Middleware
console.log("Using socket auth middleware")
io.use(socketAuthMiddleware)

// store socketOnline users to reflect online status in real-time for all users
const socketOnlineUsers = {} // {userId: socketId}

// Handle socket connection
io.on("connection", (socket) => {
  console.log(`Socket connected for user: ${socket.user.fullName}`)
  const userId = socket.user.id
  // Add user to online users list
  socketOnlineUsers[userId] = socket.id

  // Notify all clients about the updated online users list
  io.emit("getOnlineUsers", Object.keys(socketOnlineUsers))

  // Handle disconnection
  // with socket.on we can listen for events from clients
  socket.on("disconnect", () => {
    console.log(`Socket disconnected for user: ${socket.user.fullName}`)
    // Remove user from online users list
    delete socketOnlineUsers[userId]
    // Notify all clients about the updated online users list
    io.emit("getOnlineUsers", Object.keys(socketOnlineUsers))
  })
})

export { app, server, io }
