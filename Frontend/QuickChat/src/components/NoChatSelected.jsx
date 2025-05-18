import { MessageSquare } from "lucide-react";
const NoChatSelected = () => {
    return (
        <div className={`w-full hidden xl:flex rounded-md flex-1 flex-col items-center justify-center p-16 bg-base-300`} >
            <div className="max-w-md text-center space-y-6">
                {/* Icon Display */}
                <div className="flex justify-center gap-4 mb-4">
                    <div className="relative">
                        <div
                            className="w-16 h-16 rounded-2xl p bg-primary/10 flex items-center justify-center animate-bounce"
                        >
                            <MessageSquare className="w-8 h-8 text-primary " />
                        </div>
                    </div>
                </div>

                {/* Welcome Text */}
                <h2 className="text-4xl lobster-regular font-bold">Welcome to QuickChat!</h2>
                <p className="text-base-content/60">
                    Select a conversation from the sidebar to start chatting
                </p>
            </div>
        </div>
    );
};

export default NoChatSelected;