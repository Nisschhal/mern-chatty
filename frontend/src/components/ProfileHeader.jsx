import { useState, useRef } from "react"
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import { useEffect } from "react"

const mouseClickSound = new Audio("/sounds/mouse-click.mp3")

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore()
  const { isSoundEnabled, toggleSound } = useChatStore()
  const [selectedImg, setSelectedImg] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {}, [authUser])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Reset input immediately after selection to allow same-file retries
    e.target.value = ""

    const reader = new FileReader()
    reader.readAsDataURL(file)
    console.log("FileReader:", reader)
    reader.onloadend = async () => {
      const base64Image = reader.result
      console.log("Base64 Image:", base64Image)

      try {
        // Temporarily set preview (optimistic UI)
        setSelectedImg(base64Image)

        // Update profile picture in the backend
        await updateProfile({ profilePic: base64Image })
        // If success, preview stays (or update from authUser if backend returns new URL)
      } catch (error) {
        console.error("Profile update failed:", error)
        // Revert preview on failure
        setSelectedImg(null)
        // Optional: toast.error("Upload failed. Please try again.")  // If using react-hot-toast
      }
    }
  }

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar avatar-online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0 // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error))
              toggleSound()
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
export default ProfileHeader
