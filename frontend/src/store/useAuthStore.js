import { create } from "zustand"

export const useAuthStore = create((set) => ({
  authUser: { name: "Nischal", _id: "12345", age: 25 },
  isLoading: false,
  isLoggedIn: false,
  login: () => {
    set((state) => ({ isLoggedIn: !state.isLoggedIn }))
    console.log("login successful")
  },
  logout: () => {},
  //   token: null,
  //   setAuth: (user, token) => set({ user, token }),
  //   clearAuth: () => set({ user: null, token: null }),
}))
