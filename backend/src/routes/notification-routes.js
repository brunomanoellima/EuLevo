const { Router } = require('express');

const { asyncHandler } = require('../middlewares/async-handler');
const { authMiddleware } = require('../middlewares/auth-middleware');

function createNotificationRoutes(controller) {
  const router = Router();

  router.use(authMiddleware);
  router.get('/', asyncHandler(controller.list));
  router.post('/read-all', asyncHandler(controller.markRead));

  return router;
}

module.exports = {
  createNotificationRoutes,
};
