import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-gray-200 hover:bg-teal-500 hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg transition-all duration-200"
    >
      <img
        src={user.pic}
        alt={user.name}
        className="w-8 h-8 rounded-full mr-2"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.name || "User");
        }}
      />
      <div>
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs">
          <b>Email: </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
