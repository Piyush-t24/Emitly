import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {/* Header Box */}
      {/* <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800 font-work-sans">
          Emitly
        </h1>
      </div> */}
      {/* <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-center my-8">
        <img
          src="/assets/EmitlyLogo/Emitly.png" // ← path to your logo file
          alt="Emitly Logo"
          className="mx-auto h-16 object-contain" // adjust size as needed
        />
      </div> */}
      <div className="w-full h-20 sm:h-20 md:h-20 bg-white rounded-lg border border-gray-200 shadow-sm text-center my-8 overflow-visible flex items-center justify-center">
        <img
          src="/assets/EmitlyLogo/Emitly.png"
          alt="Emitly Logo"
          className="h-32 sm:h-40 md:h-48 w-auto object-contain"
        />
      </div>

      {/* Tabs Container */}
      <div className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        {/* Tab Buttons */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 px-4 rounded-full transition-colors ${
              activeTab === "login"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-pressed={activeTab === "login"}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 px-4 rounded-full transition-colors ${
              activeTab === "signup"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-pressed={activeTab === "signup"}
          >
            Sign Up
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-gray-800">
          {activeTab === "login" ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
