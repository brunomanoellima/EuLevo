const { Router } = require('express');

const { asyncHandler } = require('../middlewares/async-handler');

function createAuthRoutes(controller) {
  const router = Router();

  router.post('/login', asyncHandler(controller.login));
  router.post('/register', asyncHandler(controller.register));
  router.post('/recover-password', asyncHandler(controller.recoverPassword));

  return router;
}

module.exports = {
  createAuthRoutes,
};
