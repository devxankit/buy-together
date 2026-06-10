const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.send(notifications);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).send({ message: 'Notification not found' });
    }
    res.send(notification);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
    res.send({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    if (!notification) {
      return res.status(404).send({ message: 'Notification not found' });
    }
    res.send({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notification = await Notification.create({
      recipient: req.user.id,
      title,
      message,
      type: type || 'info',
    });
    res.status(201).send(notification);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
};
