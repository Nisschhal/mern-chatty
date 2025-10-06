import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data.user })
      console.log("Auth check response:", res.data)
    } catch (err) {
      console.log("error in checking auth", err.response.data.message)
    } finally {
      set({ isCheckingAuth: false })
    }
  },
}))
