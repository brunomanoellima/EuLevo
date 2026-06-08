function createAuthController(service) {
  return {
    login(req, res) {
      res.json(service.login(req.body));
    },
    register(req, res) {
      res.status(201).json(service.register(req.body));
    },
    recoverPassword(req, res) {
      res.json(service.recoverPassword(req.body));
    },
  };
}

module.exports = {
  createAuthController,
};
