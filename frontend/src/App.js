import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import { Toaster } from "react-hot-toast";
import { startKeepAlive, stopKeepAlive } from "./services/keepAliveService";

function App() {
  useEffect(() => {
    startKeepAlive();
    return () => {
      stopKeepAlive();
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
