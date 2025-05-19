import { MessageSquare } from "lucide-react"

const ScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className={`w-full h-screen flex rounded-md flex-1 flex-col items-center justify-center p-16 bg-base-300`} >
        <div className="max-w-md text-center space-y-6">
          <div className="flex justify-center gap-4 mb-2">
            <div className="relative">
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-2xl p bg-primary/10 flex items-center justify-center animate-bounce"
              >
                <MessageSquare className="md:w-8 md:h-8 w-6 h-6 text-primary " />
              </div>
            </div>
            <h2 className="md:text-5xl text-3xl lobster-regular font-bold">QuickChat!</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScreenLoader