import { useChatStore } from "../store/useChatStore"

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore()

  return (
    <div className="tabs tabs-box bg-transparent p-2 m-2 w-full">
      {" "}
      {/* Added w-full; fixed to tabs-boxed */}
      <button
        onClick={() => setActiveTab("chats")}
        className={` flex-1 text-sm justify-center ${
          activeTab === "chats"
            ? "rounded-md bg-cyan-500/20 text-cyan-400"
            : "text-slate-400"
        }`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`text-sm px-4 py-2  flex-1 justify-center ${
          activeTab === "contacts"
            ? "rounded-md bg-cyan-500/20 text-cyan-400"
            : "text-slate-400"
        }`}
      >
        Contacts
      </button>
    </div>
  )
}
export default ActiveTabSwitch
