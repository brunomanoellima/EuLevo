const { Router } = require('express');

const { asyncHandler } = require('../middlewares/async-handler');
const { authMiddleware } = require('../middlewares/auth-middleware');

function createInvitationRoutes(controller) {
  const router = Router();

  router.use(authMiddleware);
  router.get('/', asyncHandler(controller.list));
  router.post('/:invitationId/accept', asyncHandler(controller.accept));
  router.post('/:invitationId/decline', asyncHandler(controller.decline));

  return router;
}

module.exports = {
  createInvitationRoutes,
};
