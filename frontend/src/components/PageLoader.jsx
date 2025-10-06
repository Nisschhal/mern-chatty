import { LoaderIcon } from "lucide-react"
const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoaderIcon className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
    </div>
  )
}

export default PageLoader
