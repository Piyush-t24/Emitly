import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiBell, HiChevronDown } from "react-icons/hi";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import toast from "react-hot-toast";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
    fetchNotifications,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter something in search", { position: "top-left" });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load the search results", {
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setIsOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat", { position: "bottom-left" });
    } finally {
      setLoadingChat(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      // Mark notification as read
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.put(`/api/notification/${notif._id}/read`, {}, config);

      // Update local state
      setNotification(notification.filter((n) => n._id !== notif._id));

      // Set selected chat
      setSelectedChat(notif.chat);
      setIsNotificationOpen(false);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Still proceed with selecting chat even if marking as read fails
      setSelectedChat(notif.chat);
      setIsNotificationOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white w-full px-4 py-2 border-b-4">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2"
        >
          <i className="fas fa-search" />
          <span className="hidden md:inline px-2">Search User</span>
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
            Search Users to chat
          </span>
        </button>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-2xl font-bold text-[#1e3a8a] font-sans">
          <img
            src="/assets/EmitlyLogo/Logo2.png"
            alt="Emitly Logo"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain"
          />
          <span>Emitly - A Socket.IO Based Chat Application</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative group" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <HiBell className="text-2xl cursor-pointer" />
              {notification.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {notification.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {notification.filter((n) => !n.isRead).length > 0
                ? `You have ${
                    notification.filter((n) => !n.isRead).length
                  } new message${
                    notification.filter((n) => !n.isRead).length > 1 ? "s" : ""
                  }`
                : "No new messages"}
            </span>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                {notification.filter((n) => !n.isRead).length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {notification
                      .filter((n) => !n.isRead)
                      .map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={notif.sender.pic}
                              alt={notif.sender.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {notif.sender.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {notif.message.content.length > 50
                                  ? notif.message.content.substring(0, 50) +
                                    "..."
                                  : notif.message.content}
                              </p>
                              <p className="text-xs text-gray-400">
                                {notif.chat.isGroupChat
                                  ? notif.chat.chatName
                                  : "Direct Message"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No new notifications
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-white px-2 py-1 rounded shadow hover:bg-gray-100 "
            >
              <img
                className="h-8 w-8 rounded-full cursor-pointer"
                src={user.pic}
                alt={user.name}
              />
              <HiChevronDown />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow z-10 ho">
                <ProfileModal user={user}>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                    My Profile
                  </button>
                </ProfileModal>
                <hr />
                <button
                  onClick={logoutHandler}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-start z-50">
          <div className="w-80 bg-white p-4 h-full">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Search Users
            </h2>
            <div className="flex mb-4">
              <input
                className="flex-1 border rounded px-3 py-2 mr-2"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-[#1e3a8a] text-white px-3 py-2 rounded"
              >
                Go
              </button>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <div className="flex justify-center">
                <span className="loader" />
              </div>
            )}
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}

export default SideDrawer;
