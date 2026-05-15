import { useState, useCallback } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { mockChats } from "./mockChats";

const WhatsAppLayout = ({ hideSidebar = false }) => {
    const [chats, setChats] = useState(mockChats);
    const [activeChat, setActiveChat] = useState(null);
    const [drafts, setDrafts] = useState({});

    const handleSelectChat = useCallback((chat) => {
        setActiveChat(chat);

        setChats((prev) =>
            prev.map((c) =>
                c.id === chat.id ? { ...c, unreadCount: 0 } : c
            )
        );
    }, []);

    return (
        <div className="h-[calc(100vh-80px-32px)] p-4 bg-gray-100 dark:bg-[#1a222c]">
            <div className="h-full flex bg-white dark:bg-[#111b21] rounded-xl shadow-md border border-gray-200 dark:border-[#2a3942] overflow-hidden">

                {/* Sidebar */}
                {!hideSidebar && (
                    <ChatSidebar
                        chats={chats}
                        activeChatId={activeChat?.id}
                        onSelectChat={handleSelectChat}
                    />
                )}

                {/* Chat Window */}
                <ChatWindow
                    activeChat={activeChat}
                    setChats={setChats}
                    setActiveChat={setActiveChat}
                    drafts={drafts}
                    setDrafts={setDrafts}
                />

            </div>
        </div>
    );
};

export default WhatsAppLayout;
