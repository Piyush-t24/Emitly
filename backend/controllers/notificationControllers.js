const asyncHandler = require("express-async-handler");
const Notification = require("../Models/notificationModel");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

//@description     Get all notifications for a user
//@route           GET /api/notification
//@access          Protected
const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name pic email")
      .populate("message", "content")
      .populate("chat", "chatName isGroupChat")
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Mark notification as read
//@route           PUT /api/notification/:notificationId/read
//@access          Protected
const markAsRead = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Mark all notifications as read for a user
//@route           PUT /api/notification/read-all
//@access          Protected
const markAllAsRead = asyncHandler(async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Delete a notification
//@route           DELETE /api/notification/:notificationId
//@access          Protected
const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(
      req.params.notificationId
    );

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get unread notification count
//@route           GET /api/notification/count
//@access          Protected
const getUnreadCount = asyncHandler(async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create notification (internal function)
//@route           Internal
//@access          Internal
const createNotification = async (
  recipientId,
  senderId,
  messageId,
  chatId,
  type = "message"
) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      message: messageId,
      chat: chatId,
      type: type,
    });

    return await Notification.findById(notification._id)
      .populate("sender", "name pic email")
      .populate("message", "content")
      .populate("chat", "chatName isGroupChat");
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createNotification,
};
