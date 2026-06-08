function createNotificationController(service) {
  return {
    list(req, res) {
      res.json(service.listNotifications(req.query.userId));
    },
    markRead(req, res) {
      res.json(service.markNotificationsRead(req.body?.userId));
    },
  };
}

module.exports = {
  createNotificationController,
};
