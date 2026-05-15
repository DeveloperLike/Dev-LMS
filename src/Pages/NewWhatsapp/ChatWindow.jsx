import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import DateSeparator from "./DateSeparator";
import { isSameDay, getDateLabel } from "./time";

const MAX_TEXTAREA_HEIGHT = 120;

const ChatWindow = ({ activeChat, setChats, setActiveChat, drafts, setDrafts }) => {

  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [leadData, setLeadData] = useState(null);
  const messagesRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const input = drafts[activeChat?.id] || "";

  useEffect(() => {

    if (!activeChat?.conversationId || !activeChat.phone) return;

    setChatLoading(true);
    setMessages([]);

    const fetchMessages = async () => {

      try {

        const res = await fetch(
          "https://yesgermany.org:8443/wati/getConversation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              skip: 0,
              limit: 200,
              filter: {
                "other.conversationId": activeChat.conversationId
              },
              conversationId: activeChat.conversationId
            })
          }
        );

        const data = await res.json();

        const conversations = Array.isArray(data)
          ? data
          : data.conversations || [];

        const seen = new Set();

        const formattedMessages = conversations
          .map((conv) => {

            const msg = conv.other || {};

            return {
              id: msg.whatsappMessageId || msg.localMessageId || conv._id,
              chatId: activeChat.id,
              text: msg.text || "",
              fromMe: msg.owner === true,
              timestamp: msg.timestamp
                ? new Date(Number(msg.timestamp) * 1000).toISOString()
                : conv.createdAt,
              status: msg.statusString || "sent",
              replyTo: null
            };

          })
          .filter((m) => m.text)
          .filter((m) => {

            if (seen.has(m.id)) return false;

            seen.add(m.id);

            return true;

          })
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setMessages(formattedMessages);

        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "auto" });
        });

      } catch (err) {

        console.error("Failed to load messages:", err);

      }
      finally {
        setChatLoading(false);
      }

    };

    const fetchLeadData = async () => {

      try {

        const res = await fetch(
          `${baseurl}/api/v1/lead-management/find-lead-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              phone: activeChat.phone
            })
          }
        );

        const data = await res.json();

        setLeadData(data.data);

      }
      catch (err) {
        console.error("Failed to fetch lead data:", err);
      }


    };

    fetchLeadData();
    fetchMessages();

  }, [activeChat]);

  useEffect(() => {

    if (!activeChat?.id) return;

    setTimeout(() => textareaRef.current?.focus(), 0);

  }, [activeChat?.id]);


  const handleScroll = () => {

    const el = messagesRef.current;

    if (!el) return;

    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 30;

    setIsAtBottom(atBottom);

  };

  useEffect(() => {

    if (!isAtBottom) return;

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  useEffect(() => {

    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "auto";

    if (el.scrollHeight > MAX_TEXTAREA_HEIGHT) {

      el.style.height = `${MAX_TEXTAREA_HEIGHT}px`;
      el.style.overflowY = "auto";

    } else {

      el.style.height = `${el.scrollHeight}px`;
      el.style.overflowY = "hidden";

    }

  }, [input]);

  const handleInputChange = (value) => {

    if (!activeChat?.id) return;

    setDrafts((prev) => ({ ...prev, [activeChat.id]: value }));

  };

  const handleSend = () => {

    if (!input.trim() || !activeChat?.id) return;

    const now = new Date().toISOString();

    const newMessage = {
      id: Date.now(),
      chatId: activeChat.id,
      text: input.trim(),
      fromMe: true,
      timestamp: now,
      status: "sent",
      replyTo: null
    };

    try {

      setSending(true);

      fetch(
        `https://live-mt-server.wati.io/1092733/api/v1/sendSessionMessage/${activeChat.phone}?messageText=${encodeURIComponent(input.trim())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Inllc2dlcm1hbnl0b29sc0BnbWFpbC5jb20iLCJuYW1laWQiOiJ5ZXNnZXJtYW55dG9vbHNAZ21haWwuY29tIiwiZW1haWwiOiJ5ZXNnZXJtYW55dG9vbHNAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDMvMTYvMjAyNiAwNDozMToyNyIsInRlbmFudF9pZCI6IjEwOTI3MzMiLCJkYl9uYW1lIjoibXQtcHJvZC1UZW5hbnRzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQVRPUiIsImV4cCI6MjUzNDAyMzAwODAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.IpU1GlDpjqatsDEkJeSO6diui0sVJ1FqbMqec3gyHAU"
          }
        }
      );

    }
    catch (err) {
      console.error("Failed to send message:", err);
    }
    finally {
      setSending(false);
    }

    setMessages((prev) => [...prev, newMessage]);

    setDrafts((prev) => ({ ...prev, [activeChat.id]: "" }));
    console.log(replyTo);
    setReplyTo(null);

    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    );

  };



  if (!activeChat) {

    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );

  }



  return (

    <div className="flex-1 flex flex-col bg-white dark:bg-[#0b141a]">

      {/* Header */}

      <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2a3942]">

        <p className="font-medium text-gray-900 dark:text-white">
          {activeChat.leadId ? (
            <a href={`https://lms.yesgermany.org/view-lead/${activeChat.leadId}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {activeChat.name}
            </a>
          ) : (
            activeChat.name
          )}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {activeChat.phone ? `+${activeChat.phone}` : "No WhatsApp ID"}
        </p>

      </div>



      {/* Messages */}

      <div
        ref={messagesRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >

        {chatLoading && (
          <div class="flex justify-center items-center mt-10"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div></div>
        )}

        {messages.map((msg, index) => {

          const prevMsg = messages[index - 1];

          const showDate =
            !prevMsg ||
            !isSameDay(new Date(prevMsg.timestamp), new Date(msg.timestamp));

          return (

            <div key={msg.id} className="space-y-2">

              {showDate && (
                <DateSeparator label={getDateLabel(msg.timestamp)} />
              )}

              <MessageBubble
                {...msg}
                onReply={() =>
                  setReplyTo({
                    id: msg.id,
                    text: msg.text,
                    fromMe: msg.fromMe
                  })
                }
              />

            </div>

          );

        })}

        <div ref={bottomRef} />

      </div>



      {/* Input */}

      <div className="p-3 border-t border-gray-200 dark:border-[#2a3942] bg-gray-50 dark:bg-[#111b21]">

        <div className="flex items-end gap-2">

          <div className="flex-1 rounded-2xl bg-white dark:bg-[#202c33]">

            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message"
              className="w-full resize-none px-4 py-2 bg-transparent text-gray-900 dark:text-white outline-none max-h-[120px]"
            />

          </div>

          <button
            onClick={handleSend}
            className="mb-1 w-10 h-10 flex items-center justify-center rounded-full bg-yellow-200 hover:bg-yellow-300 text-black"
          >
            <SendOutlined />
          </button>

        </div>

      </div>

    </div>

  );

};

export default ChatWindow;