const { Router } = require('express');

const { asyncHandler } = require('../middlewares/async-handler');
const { authMiddleware } = require('../middlewares/auth-middleware');

function createUserRoutes(controller) {
  const router = Router();

  router.get('/', authMiddleware, asyncHandler(controller.list));
  router.get('/:userId', authMiddleware, asyncHandler(controller.getById));

  // Atualizar perfil do usuário
  router.patch('/:userId', authMiddleware, asyncHandler(controller.update));

  return router;
}

module.exports = {
  createUserRoutes,
};