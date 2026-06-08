const jwt = require('jsonwebtoken');

const { config } = require('../config/env');
const { unauthorized } = require('../core/http-error');

function authMiddleware(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw unauthorized('Token JWT ausente.');
    }

    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, config.jwtSecret);
    req.auth = payload;
    next();
  } catch (error) {
    next(unauthorized('Token JWT invalido ou expirado.'));
  }
}

module.exports = {
  authMiddleware,
};
