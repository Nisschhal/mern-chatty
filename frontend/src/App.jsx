import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router"
import ChatPage from "./pages/chat"
import { useAuthStore } from "./store/useAuthStore"
import PageLoader from "./components/PageLoader"
import SignupPage from "./pages/Signup"
import LoginPage from "./pages/Login"

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore()
  console.log("authUser from store", authUser)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <PageLoader />

  return (
    <div className="bg-slate-900 z-0 min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS -- GRID BG & GLOW SHAPES */}
      {/* BACKGROUND */}
      <div className="-z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        {/* DECORATORS -- GLASS SHAPES */}
        <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[150px]" />
        <div className="absolute animate-[pulse_4s_infinite] bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[150px]" />
      </div>
      {/* Routes------ */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  )
}

export default App
