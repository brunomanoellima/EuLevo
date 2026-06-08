class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function badRequest(message) {
  return new HttpError(400, message);
}

function unauthorized(message = 'Nao autenticado.') {
  return new HttpError(401, message);
}

function forbidden(message = 'Acesso negado.') {
  return new HttpError(403, message);
}

function notFound(message) {
  return new HttpError(404, message);
}

function conflict(message) {
  return new HttpError(409, message);
}

module.exports = {
  HttpError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};
