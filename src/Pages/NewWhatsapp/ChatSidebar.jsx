import { useState, useMemo, useRef, useEffect } from "react";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { formatSidebarTime } from "./time";
import { PAGESIZE , baseurl} from "../../lib/Constants";

import axios from "axios";

const getInitial = (name) => name?.charAt(0).toUpperCase();

const ChatSidebar = ({ activeChatId, onSelectChat }) => {

  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [counsellorOptions, setCounsellorOptions] = useState([]);
  const [role, setRole] = useState(null);

  const inputRef = useRef(null);
  const limit = 200;

  async function fetchUserRole() {

    try {

      const profile = await axios.get(
        `${baseurl}/api/v1/user-management/profile`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        }
      );

      if (profile.status === 200) {
        setRole(profile.data.data.user_group);
      }

    } catch (err) {
      console.log("Profile fetch error");
    }

  }


  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {

    const fetchCounsellorDropdown = async () => {

      try {

        const res = await axios.get(
          `${baseurl}/api/v1/lead-management/counsellor-dropdown`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`
            }
          }
        );

        if (res.status === 200) {
          setCounsellorOptions(res.data.data);
        }

      } catch (err) {
        console.log("Counsellor fetch error");
      }

    };

    fetchCounsellorDropdown();

  }, []);

  const fetchChats = async (nextSkip = 0) => {

    try {

      if (nextSkip === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(
        `${baseurl}/api/v1/wati/getConversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            skip: nextSkip,
            limit: limit,
            counsellors: counsellorOptions.map(c => c.username),
          })
        }
      );

      const data = await res.json();
      const conversations = data.conversations || [];

      if (conversations.length < limit) {
        setHasMore(false);
      }

      const map = new Map();

      conversations.forEach((conv) => {
        const msg = conv.other || {};
        const phone = msg.waId;

        if (!phone) return;

        const timestamp = msg.timestamp
          ? Number(msg.timestamp) * 1000
          : Date.now();

        const counsellorId = msg.assign_to_id || null;

        map.set(phone, {
          id: msg.conversationId || conv._id,
          name: msg.senderName || conv.full_name || phone,
          phone: phone,
          lastMessage: msg.text || "",
          lastMessageTimestamp: timestamp,
          unreadCount: msg.owner === false ? 1 : 0,
          assignedId: counsellorId,
          conversationId: msg.conversationId,
          ticketId: msg.ticketId,
          leadId: msg.lead_id
        });

      });

      const chatsArray = Array.from(map.values());

      const filtered = chatsArray.filter((chat) => {

        if (role === "admin") {
          return true;
        }

        if (!chat.assignedId) return false;

        return counsellorOptions.some(
          c => c.username === chat.assignedId
        );

      });

      filtered.sort(
        (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
      );

      if (nextSkip === 0) {
        setChats(filtered);
      } else {

        setChats(prev => {

          const map = new Map();

          [...prev, ...filtered].forEach(chat => {
            map.set(chat.id, chat);
          });

          return Array.from(map.values());

        });

      }

    } catch (err) {

      console.log("Conversation fetch error");

    }

    setLoading(false);
    setLoadingMore(false);

  };

  useEffect(() => {

    console.log("Counsellor Options:", counsellorOptions);
    if (!counsellorOptions.length) return;

    fetchChats(0);

  }, [counsellorOptions, role]);

  const loadMoreChats = () => {

    const nextSkip = skip + limit;

    setSkip(nextSkip);

    fetchChats(nextSkip);

  };

  const handleSelectChat = (chat) => {

    setChats(prev =>
      prev.map(c =>
        c.id === chat.id
          ? { ...c, unreadCount: 0 }
          : c
      )
    );

    onSelectChat(chat);
    setSearch("");

  };


  const filteredChats = useMemo(() => {

    if (!search.trim()) return chats;

    const q = search.toLowerCase();

    return chats.filter(
      chat =>
        chat.name.toLowerCase().includes(q) ||
        chat.lastMessage?.toLowerCase().includes(q) ||
        chat.phone.includes(q)
    );

  }, [search, chats]);


  const sortedChats = [...filteredChats].sort(
    (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
  );



  return (

    <div className="w-[25%] h-full flex flex-col bg-white dark:bg-[#202c33] border-r border-gray-300 dark:border-[#2a3942]">

      <div className="px-4 py-3 font-semibold text-xl text-black dark:text-yellow-500">
        WhatsApp
      </div>


      <div className="p-2">

        <div className="relative">

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
            <SearchOutlined />
          </span>

          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full pl-9 pr-9 py-2 rounded text-sm dark:bg-grey-500 bg-gray-100 border"
          />

          {search && (

            <button
              onClick={() => {
                setSearch("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >

              <CloseOutlined />

            </button>

          )}

        </div>

      </div>


      <div className="flex-1 overflow-y-auto">

        {loading && (

          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>

        )}


        {!loading && sortedChats.length === 0 && (

          <div className="text-sm text-gray-400 text-center mt-6">
            No chats found
          </div>

        )}



        {sortedChats.map((chat) => (

          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat)}
            className={`dark:text-white text-black flex items-center gap-3 p-3 cursor-pointer overflow-hidden ${activeChatId === chat.id
              ? "bg-gray-200 dark:bg-[#2a3942] border-l-4 border-yellow-500"
              : "hover:bg-gray-200 dark:hover:bg-[#2a3942]"
              }`}
          >

            <div className="text-black w-9 h-9 flex items-center justify-center rounded-full bg-yellow-200 text-sm font-semibold flex-shrink-0">
              {getInitial(chat.name)}
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">

              <div className="flex justify-between items-center gap-2">

                <p className="text-sm font-medium truncate">
                  {chat.name}
                </p>

                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatSidebarTime(chat.lastMessageTimestamp)}
                </span>

              </div>

              <div className="flex justify-between items-center gap-2">

                <p className="text-xs truncate">
                  {chat.lastMessage || "—"}
                </p>

                {chat.unreadCount > 0 && activeChatId !== chat.id && (

                  <span className="text-black w-5 h-5 flex items-center justify-center text-[11px] rounded-full bg-yellow-200 flex-shrink-0">
                    {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                  </span>

                )}

              </div>

            </div>

          </div>

        ))}



        {hasMore && !loading && (

          <div className="flex justify-center p-3">

            <button
              onClick={loadMoreChats}
              className="text-sm bg-yellow-400 hover:bg-yellow-500 px-4 py-1 rounded"
            >

              {loadingMore ? "Loading..." : "Load More"}

            </button>

          </div>

        )}

      </div>

    </div>

  );

};

export default ChatSidebar;