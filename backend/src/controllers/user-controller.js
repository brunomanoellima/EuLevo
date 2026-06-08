function createUserController(service) {
  return {
    list(req, res) {
      res.json(service.listUsers(req.query.search));
    },
    update(req, res) {
      res.json(service.updateUser(req.params.userId, req.body));
    },
    getById(req, res) {
      res.json(service.getUserById(req.params.userId));
    },
  };
}

module.exports = {
  createUserController,
};
