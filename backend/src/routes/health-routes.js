const { Router } = require('express');

function createHealthRoutes() {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({ ok: true, service: 'eulevo-backend' });
  });

  return router;
}

module.exports = {
  createHealthRoutes,
};
