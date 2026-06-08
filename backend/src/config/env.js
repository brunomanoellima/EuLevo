const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '..', '..', '.env'),
});

const config = {
  port: Number(process.env.PORT || 3333),
  jwtSecret: process.env.JWT_SECRET || 'eulevo-dev-secret',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

module.exports = {
  config,
};
