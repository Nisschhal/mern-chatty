import React from "react"
import { useAuthStore } from "../store/useAuthStore"

const ChatPage = () => {
  const { logout } = useAuthStore()

  return (
    <div className="text-white">
      ChatPage
      <button className="btn cursor-pointer" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default ChatPage
