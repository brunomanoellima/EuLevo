function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    error: error.message || 'Erro interno do servidor.',
  });
}

module.exports = {
  errorHandler,
};
