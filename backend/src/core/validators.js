const { badRequest } = require('./http-error');

function requireText(value, message) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw badRequest(message);
  }
  return value.trim();
}

function requirePositiveNumber(value, message) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw badRequest(message);
  }
  return parsed;
}

module.exports = {
  requirePositiveNumber,
  requireText,
};
