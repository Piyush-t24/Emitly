import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

// Format timestamp to HH:MM format
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const ReadReceipt = ({ message, currentUser, chat }) => {
  if (message.sender._id !== currentUser._id) return null;

  // Helper to normalize ID comparison
  const normalizeId = (id) => {
    if (!id) return null;
    return typeof id === "object"
      ? id._id
        ? id._id.toString()
        : id.toString()
      : id.toString();
  };

  // For group chats, check if all other users have read
  // For direct chats, check if the recipient has read
  const getReadStatus = () => {
    if (!chat || !message.readBy || message.readBy.length === 0) {
      return { isRead: false, isDelivered: true };
    }

    const currentUserId = normalizeId(currentUser._id);
    const readByIds = message.readBy.map((id) => normalizeId(id));

    if (chat.isGroupChat) {
      // In group chat, check if all other members (except sender) have read
      const otherUsers = chat.users
        .filter((u) => normalizeId(u._id || u) !== currentUserId)
        .map((u) => normalizeId(u._id || u));

      if (otherUsers.length === 0) return { isRead: false, isDelivered: true };

      const allRead = otherUsers.every((userId) => readByIds.includes(userId));
      return { isRead: allRead, isDelivered: true };
    } else {
      // Direct chat - check if recipient has read
      const recipient = chat.users.find((u) => {
        const userId = normalizeId(u._id || u);
        return userId !== currentUserId;
      });

      if (!recipient) return { isRead: false, isDelivered: true };

      const recipientId = normalizeId(recipient._id || recipient);
      const isRead = readByIds.includes(recipientId);

      return { isRead, isDelivered: true };
    }
  };

  const { isRead, isDelivered } = getReadStatus();

  return (
    <span className="ml-0.5 text-[12px] inline-flex items-center leading-none">
      {isRead ? (
        <span className="text-[#9de1fe] font-semibold">✓✓</span>
      ) : isDelivered ? (
        <span className="text-gray-600 opacity-90">✓✓</span>
      ) : (
        <span className="text-gray-600 opacity-90">✓</span>
      )}
    </span>
  );
};

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex flex-col" key={m._id}>
            <div className="flex">
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <div className="relative group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 z-10">
                    {m.sender.name}
                  </div>
                  <img
                    className="mt-2 mr-1 w-8 h-8 rounded-full cursor-pointer"
                    src={m.sender.pic}
                    alt={m.sender.name}
                  />
                </div>
              )}
              <div
                className={`flex items-end ${
                  m.sender._id === user._id ? "ml-auto" : ""
                }`}
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                <div
                  className={`relative px-2.5 py-1.5 pb-1.5 rounded-2xl max-w-[75%] shadow-sm ${
                    m.sender._id === user._id ? "bg-blue-200" : "bg-blue-100"
                  }`}
                  style={{
                    borderRadius:
                      m.sender._id === user._id
                        ? "7.5px 7.5px 0 7.5px"
                        : "7.5px 7.5px 7.5px 0",
                  }}
                >
                  <div className="break-words pr-14 pb-0.5 text-[14.2px] leading-[19px]">
                    {m.content}
                  </div>
                  <div
                    className={`absolute bottom-1.5 right-2 flex items-center gap-0.5 leading-none ${
                      m.sender._id === user._id
                        ? "text-gray-600"
                        : "text-gray-600"
                    }`}
                  >
                    <span className="text-[11px] whitespace-nowrap leading-none">
                      {formatTime(m.createdAt || m.timestamp)}
                    </span>
                    {m.sender._id === user._id && (
                      <ReadReceipt
                        message={m}
                        currentUser={user}
                        chat={selectedChat}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
