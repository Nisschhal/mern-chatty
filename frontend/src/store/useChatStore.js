import { create } from "zustand"
import { toast } from "react-hot-toast"
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  // Functionns to update the state
  toggleSound: () => {
    const currentSound = get().isSoundEnabled
    localStorage.setItem("isSoundEnabled", !currentSound)
    set({ isSoundEnabled: !currentSound })
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUserLoading: true })
    try {
      const res = await axiosInstance.get("/messages/contacts")
      set({ allContacts: res.data })
    } catch (error) {
      console.log("Error fetching contacts:", error)
      toast.error("Error fetching contacts", error.response?.data?.error)
    } finally {
      set({ isUserLoading: false })
    }
  },
  getMyChatPartners: async () => {
    set({ isUserLoading: true })
    try {
      const res = await axiosInstance.get("/messages/chats")
      set({ chats: res.data })
    } catch (error) {
      console.log("Error fetching chat partners:", error)
    } finally {
      set({ isUserLoading: false })
    }
  },
}))
