import { ChatState } from "../../Context/ChatProvider";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const isAdmin = admin && admin._id === user._id;

  return (
    <div className="flex items-center bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
      <img
        src={user.pic}
        alt={user.name}
        className="w-3 h-3 rounded-full mr-1"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://ui-avatars.com/api/?size=24&name=" +
            encodeURIComponent(user.name || "User");
        }}
      />
      <span className="mr-1 font-medium">{user.name}</span>
      {isAdmin && (
        <span className="text-xs bg-purple-800 px-1 rounded mr-1">Admin</span>
      )}
      <button
        onClick={handleFunction}
        className="text-white hover:text-red-200 font-bold text-sm leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default UserBadgeItem;
