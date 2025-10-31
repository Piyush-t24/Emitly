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
      <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800 font-work-sans">
          RGVerse Discussion
        </h1>
      </div>

      {/* Tabs Container */}
      <div className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        {/* Tab Buttons */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 px-4 rounded-full transition-colors ${
              activeTab === "login"
                ? "bg-green-600 text-white"
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
                ? "bg-green-600 text-white"
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
