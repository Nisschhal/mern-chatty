import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data })
    } catch (error) {
      console.log("Error in authCheck:", error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    console.log("Signup data:", data)
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data)
      console.log("Signup res:", res)
      set({ authUser: res.data })

      toast.success("Account created successfully!")
      // Connect socket after signup
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.error || "Signup failed")
      console.log("Signup error:", error)
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data)
      set({ authUser: res.data })

      toast.success("Logged in successfully")
      // Connect socket after login
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.error || "Login failed")
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
      // Disconnect socket on logout
      get().disconnectSocket()
    } catch (error) {
      toast.error("Error logging out")
      console.log("Logout error:", error)
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/profile-update", data)
      console.log("Profile update res:", res)
      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("Error in update profile:", error)
      toast.error(error.response.data.error || "Profile update failed")
    }
  },

  connectSocket: () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected) return

    const socket = io(BASE_URL, {
      withCredentials: true,
    })

    socket.connect()

    set({ socket })

    // Listen for online users list update from the connection
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    const { socket } = get()
    if (socket?.connected) {
      socket.disconnect()
      set({ socket: null, onlineUsers: [] })
    }
  },
}))
