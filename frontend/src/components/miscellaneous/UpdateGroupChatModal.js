import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { HiEye } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import { useToast } from "../../hooks/use-toast";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { toast } = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
    } catch (err) {
      toast.error("Error loading search results");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast.error("Rename failed");
    } finally {
      setRenameLoading(false);
      setGroupChatName("");
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in group");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add");
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (err) {
      toast.error("Add user failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admin can remove");
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (err) {
      toast.error("Remove user failed");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    document.getElementById("update-group-modal").close();
  };

  return (
    <>
      <button
        className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={() =>
          document.getElementById("update-group-modal").showModal()
        }
      >
        <HiEye className="text-xl" />
      </button>

      <dialog id="update-group-modal" className="modal backdrop-blur-sm">
        <div className="modal-box w-12/12 max-w-lg bg-white rounded-lg shadow-xl border-0 p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-900">
              {selectedChat.chatName}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              <HiX className="text-sm" />
            </button>
          </div>

          {/* Group Members */}
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>

          {/* Chat Name Update */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              onClick={handleRename}
              disabled={renameloading}
              className="px-6 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {renameloading ? "Updating..." : "Update"}
            </button>
          </div>

          {/* Add User Input */}
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent mb-4"
            placeholder="Add User to group"
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Search Results */}
          <div className="overflow-y-auto max-h-40 space-y-1 mb-6">
            {loading ? (
              <div className="text-center text-gray-500 py-2 text-sm">
                Loading...
              </div>
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </div>

          {/* Leave Group Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                handleRemove(user);
                closeModal();
              }}
              className="px-6 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Leave Group
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default UpdateGroupChatModal;
