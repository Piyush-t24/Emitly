import axios from "axios";

/**
 * Keep-alive service to prevent Render.com cold starts
 * Pings the server health endpoint every 5 minutes
 */

const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get the API URL - in production, use the full backend URL, in dev use proxy
const getHealthCheckUrl = () => {
  if (process.env.NODE_ENV === "production") {
    // In production, frontend and backend are on the same domain (single deployment)
    // So we can use the current origin
    return `${window.location.origin}/health`;
  }
  // In development, use the proxy
  return "/health";
};

let keepAliveInterval = null;

export const startKeepAlive = () => {
  // Clear any existing interval
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }

  // Ping immediately
  pingServer();

  // Then ping every 5 minutes
  keepAliveInterval = setInterval(() => {
    pingServer();
  }, KEEP_ALIVE_INTERVAL);

  console.log("Keep-alive service started - pinging server every 5 minutes");
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log("Keep-alive service stopped");
  }
};

const pingServer = async () => {
  try {
    const healthUrl = getHealthCheckUrl();
    const response = await axios.get(healthUrl, {
      timeout: 5000, // 5 second timeout
    });

    if (response.data.status === "OK") {
      console.log(
        "✅ Keep-alive ping successful:",
        new Date().toLocaleTimeString()
      );
    }
  } catch (error) {
    // Silently fail - don't spam console on errors
    // The server might be sleeping, which is why we're pinging it
    console.warn(
      "⚠️ Keep-alive ping failed (this is normal if server is sleeping):",
      error.message
    );
  }
};
