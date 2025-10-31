import { useState } from "react";
import { HiEye } from "react-icons/hi";
import { HiX } from "react-icons/hi";

const ProfileModal = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {children ? (
        <span onClick={openModal} className="cursor-pointer">
          {children}
        </span>
      ) : (
        <button
          onClick={openModal}
          className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <HiEye className="text-xl" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg overflow-hidden">
            <div className="relative flex items-center justify-center px-5 py-3 border-b">
              <h2 className="text-2xl font-semibold font-sans text-center">
                {user.name}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close profile modal"
                className="absolute right-3 top-3 p-1 rounded text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col items-center gap-4">
              <img
                className="rounded-full w-32 h-32 object-cover"
                src={
                  user.pic ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name || "User")
                }
                alt={user.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name || "User");
                }}
              />
              <p className="text-base font-sans">Email: {user.email}</p>
            </div>
            <div className="flex justify-end px-5 py-3 border-t">
              <button
                onClick={closeModal}
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
