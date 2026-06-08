const { Router } = require('express');

const { asyncHandler } = require('../middlewares/async-handler');
const { authMiddleware } = require('../middlewares/auth-middleware');

function createEventRoutes(controller) {
  const router = Router();

  router.use(authMiddleware);

  router.get('/', asyncHandler(controller.list));
  router.post('/', asyncHandler(controller.create));
  router.get('/:eventId', asyncHandler(controller.getById));
  router.delete('/:eventId', asyncHandler(controller.remove));

  router.get('/:eventId/participants', asyncHandler(controller.listParticipants));
  router.post('/:eventId/participants', asyncHandler(controller.addParticipant));

  router.get('/:eventId/items', asyncHandler(controller.listItems));
  router.post('/:eventId/items', asyncHandler(controller.createItem));
  router.patch('/:eventId/items/:itemId', asyncHandler(controller.updateItem));
  router.delete('/:eventId/items/:itemId', asyncHandler(controller.deleteItem));
  router.post('/:eventId/items/:itemId/assign', asyncHandler(controller.assignItem));
  router.post('/:eventId/items/:itemId/unassign', asyncHandler(controller.unassignItem));

  router.get('/:eventId/messages', asyncHandler(controller.listMessages));
  router.post('/:eventId/messages', asyncHandler(controller.createMessage));

  router.get('/:eventId/history', asyncHandler(controller.listHistory));
router.get('/:eventId/invitations', asyncHandler(controller.listEventInvitations));
  return router;
}

module.exports = {
  createEventRoutes,
};