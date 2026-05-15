import { formatMessageTime } from "./time";
import { CgMailReply } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";

const MessageBubble = ({
    text,
    fromMe,
    timestamp,
    status,
    replyTo,
    onReply,
}) => {
    const time = formatMessageTime(timestamp);

    const renderTicks = () => {
        if (!fromMe) return null;

        if (status === "sent") {
            return <FaCheck className="text-[10px] ml-1 text-gray-600 dark:text-gray-500" />;
        }

        if (status === "delivered") {
            return (
                <>
                    <FaCheck className="text-[10px] text-gray-600 dark:text-gray-500" />
                    <FaCheck className="text-[10px] -ml-1 text-gray-600 dark:text-gray-500" />
                </>
            );
        }

        if (status === "read") {
            return (
                <>
                    <FaCheck className="text-[10px] text-blue-500" />
                    <FaCheck className="text-[10px] -ml-1 text-blue-500" />
                </>
            );
        }

        return null;
    };

    return (
        <div className={`flex mb-2 ${fromMe ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative group max-w-[60%] px-3 py-2 rounded-lg text-sm
                ${fromMe
                        ? "bg-yellow-200 text-gray-900"
                        : "bg-gray-200 text-gray-900 dark:bg-[#202c33] dark:text-white"
                    }`}
            >
                {/* Reply preview */}
                {replyTo && (
                    <div className="mb-1 px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-xs border-l-4 border-yellow-400">
                        <p className="font-semibold">
                            {replyTo.fromMe ? "You" : "Reply"}
                        </p>
                        <p className="truncate">{replyTo.text}</p>
                    </div>
                )}

                {/* Message text */}
                <p className="whitespace-pre-wrap break-words">{text}</p>

                {/* Time + ticks */}
                <div className="flex items-center justify-end gap-1 mt-1">
                    {time && (
                        <span
                            className={`text-[10px] leading-none
                            ${fromMe
                                    ? "text-gray-700"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            {time}
                        </span>
                    )}
                    {renderTicks()}
                </div>

                {/* Reply button */}
                {onReply && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onReply();
                        }}
                        className={`absolute top-1/2 -translate-y-1/2
                        ${fromMe ? "-left-7" : "-right-7"}
                        opacity-0 group-hover:opacity-100
                        transition-opacity
                        text-gray-500 hover:text-yellow-500`}
                    >
                        <CgMailReply size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
