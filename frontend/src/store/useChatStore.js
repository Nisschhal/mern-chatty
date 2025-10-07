import { create } from "zustand"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === "true",

  // Functionns to update the state
  toggleSound: () => {
    const currentSound = get().isSoundEnabled
    JSON.stringify(localStorage.setItem("isSoundEnabled", !currentSound))
    set({ isSoundEnabled: !currentSound })
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/message/contacts")
      console.log("Contacts fetched:", res.data)
      set({ allContacts: res.data })
    } catch (error) {
      console.log("Error fetching contacts:", error)
      toast.error("Error fetching contacts", error.response?.data?.error)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/message/chats")
      console.log("Full API response:", res.data) // ADD: Debug what backend sends
      // FIX: Extract array safely (adjust 'data' or 'chats' to match your backend)
      const chatArray = res.data.chats || res.data.data || res.data || [] // Fallback to empty array
      set({ chats: chatArray })
    } catch (error) {
      console.log("Error fetching chat partners:", error)
      toast.error("Failed to load chats") // Optional: User feedback
      set({ chats: [] }) // ADD: Reset to empty on error
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/message/${userId}`)
      console.log("Messages fetched:", res.data)
      set({ messages: res.data })
    } catch (error) {
      console.log("Error fetching messages:", error)
      toast.error("Error fetching messages", error.response?.data?.error)
    } finally {
      set({ isMessagesLoading: false })
    }
  },
  subscribeToMessages: () => {},
  unsubscribeFromMessages: () => {},
}))
