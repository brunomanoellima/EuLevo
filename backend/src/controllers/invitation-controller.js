function createInvitationController(service) {
  return {
    list(req, res) {
      res.json(service.listInvitationsForUser(req.query.userId));
    },
    accept(req, res) {
      res.json(service.acceptInvitation(req.params.invitationId, req.body?.userId));
    },
    decline(req, res) {
      res.json(service.declineInvitation(req.params.invitationId, req.body?.userId));
    },
  };
}

module.exports = {
  createInvitationController,
};
