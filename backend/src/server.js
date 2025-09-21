import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

const app = express()

const PORT = process.env.PORT || 3000
console.log("PORT:", PORT)

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
