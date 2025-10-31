import { useState, useCallback } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

    // Return methods for different toast types
    return {
      success: (msg) => toast(msg, "success"),
      error: (msg) => toast(msg, "error"),
      info: (msg) => toast(msg, "info"),
      warning: (msg) => toast(msg, "warning"),
    };
  }, []);

  // Enhanced toast with type methods
  toast.success = (message) => toast(message, "success");
  toast.error = (message) => toast(message, "error");
  toast.info = (message) => toast(message, "info");
  toast.warning = (message) => toast(message, "warning");

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toast,
    toasts,
    removeToast,
  };
};

export { useToast };
