const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.route("/").get(protect, getNotifications);
router.route("/count").get(protect, getUnreadCount);
router.route("/read-all").put(protect, markAllAsRead);
router.route("/:notificationId/read").put(protect, markAsRead);
router.route("/:notificationId").delete(protect, deleteNotification);

module.exports = router;
