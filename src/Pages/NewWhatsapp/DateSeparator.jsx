const DateSeparator = ({ label, variant = "date" }) => {
  const isUnread = variant === "unread";

  return (
    <div className="flex justify-center my-4">
      <span
        className={`px-3 py-1 text-xs rounded-full
        ${isUnread
            ? "bg-yellow-200 text-gray-900 font-semibold"
            : "bg-gray-200 dark:bg-[#202c33] text-gray-600 dark:text-gray-300"
          }`}
      >
        {label}
      </span>
    </div>
  );
};

export default DateSeparator;
