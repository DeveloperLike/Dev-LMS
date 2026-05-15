import { useEffect, useState } from "react";

const ChatHeader = ({ chat, isTyping }) => {
    const [showTyping, setShowTyping] = useState(false);

    useEffect(() => {
        if (isTyping) {
            setShowTyping(true);
            return;
        }

        const t = setTimeout(() => setShowTyping(false), 800);
        return () => clearTimeout(t);
    }, [isTyping]);

    if (!chat) return null;

    return (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2a3942] flex items-center gap-3 bg-white dark:bg-[#0b141a]">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-gray-900 font-semibold">
                {chat.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                    {chat.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {showTyping
                        ? `${chat.name.split(" ")[0]} is typing…`
                        : chat.isOnline
                            ? "online"
                            : "offline"}
                </p>
            </div>
        </div>
    );
};

export default ChatHeader;
