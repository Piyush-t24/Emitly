import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    fetchNotifications,
  } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const markMessagesAsRead = async () => {
    if (!selectedChat || !selectedChat._id) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.put(`/api/message/read/${selectedChat._id}`, {}, config);

      // Update local messages to reflect read status
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.sender._id !== user._id && !msg.readBy?.includes(user._id)) {
            return {
              ...msg,
              readBy: [...(msg.readBy || []), user._id],
            };
          }
          return msg;
        })
      );

      // Emit read receipt via socket
      if (socket) {
        socket.emit("message read", {
          chatId: selectedChat._id,
          userId: user._id,
        });
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat._id) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);

      // Mark messages as read
      markMessagesAsRead();
    } catch (error) {
      alert("Failed to load messages!");
    }
  };

  const sendMessage = async (event) => {
    // Handle Enter key press
    if (event && event.key && event.key !== "Enter") return;

    if (newMessage && selectedChat?._id) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageContent = newMessage;
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: messageContent, chatId: selectedChat },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("Failed to send message!");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

    // Clear notifications for the selected chat
    if (selectedChat) {
      // Mark all notifications for this chat as read
      const markChatNotificationsAsRead = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          // Get all unread notifications for this chat
          const chatNotifications = notification.filter(
            (n) => n.chat?._id === selectedChat?._id && !n.isRead
          );

          // Mark each as read
          for (const notif of chatNotifications) {
            await axios.put(`/api/notification/${notif._id}/read`, {}, config);
          }

          // Refresh notifications from database
          await fetchNotifications();
        } catch (error) {
          console.error("Error marking chat notifications as read:", error);
        }
      };

      markChatNotificationsAsRead();
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Refresh notifications from database when receiving a message from another chat
        fetchNotifications();
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
        // Mark as read if viewing the chat
        markMessagesAsRead();
      }
    });

    socket.on("messages read", (data) => {
      if (
        selectedChatCompare &&
        selectedChatCompare._id === data.chatId &&
        data.userId !== user._id
      ) {
        // Update messages when recipient reads them
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (
              msg.sender._id === user._id &&
              !msg.readBy?.includes(data.userId)
            ) {
              return {
                ...msg,
                readBy: [...(msg.readBy || []), data.userId],
              };
            }
            return msg;
          })
        );
      }
    });

    return () => {
      socket.off("message recieved");
      socket.off("messages read");
    };
  }, [selectedChatCompare, messages, fetchAgain, fetchNotifications, user._id]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected || !selectedChat?._id) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const onEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    // Focus back on input after emoji selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest("[data-emoji-button]")
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-between w-full px-2 pb-3 font-sans text-[28px] md:text-[30px] font-medium">
            <button
              className="flex p-2 rounded hover:bg-gray-200"
              onClick={() => setSelectedChat("")}
            >
              <ArrowLeft size={24} />
            </button>
            {messages &&
              selectedChat &&
              (!selectedChat.isGroupChat ? (
                <div className="flex items-center gap-2">
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {selectedChat.chatName?.toUpperCase() || "Group Chat"}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </div>
              ))}
          </div>

          {/* Messages area */}
          <div className="flex flex-col justify-end w-full h-full p-3 bg-gray-200 rounded-lg overflow-y-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-800"></div>
              </div>
            ) : (
              <div className="messages flex-1 overflow-y-auto">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Input area */}
            <div className="mt-3 relative">
              {istyping && (
                <div className="mb-2">
                  <Lottie options={defaultOptions} width={70} />
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  data-emoji-button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center justify-center px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition-colors"
                  type="button"
                >
                  <Smile size={20} className="text-gray-700" />
                </button>
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full left-0 mb-2 z-50"
                  >
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={350}
                      height={400}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                  className="flex-1 px-4 py-2 rounded-md bg-gray-300 placeholder-gray-600 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage || !selectedChat?._id}
                  className="flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <h2 className="text-3xl font-sans pb-3">
            Click on a user to start chatting
          </h2>
        </div>
      )}
    </>
  );
};

export default SingleChat;
