function createEventController(service) {
  return {
    
    list(req, res) {
      res.json(service.listEventsForUser(req.query.userId));
    },

    create(req, res) {
      res.status(201).json(service.createEvent(req.body));
    },

    getById(req, res) {
      res.json(service.getEventById(req.params.eventId));
    },

    remove(req, res) {
      service.deleteEvent(req.params.eventId, req.body?.requesterId);
      res.status(204).send();
    },

    listParticipants(req, res) {
      res.json(service.listParticipants(req.params.eventId));
    },
listEventInvitations(req, res) {
  res.json(
    service.listEventInvitations(
      req.params.eventId,
      req.query.requesterId
    )
  );
},
    addParticipant(req, res) {
      res.status(201).json(service.createInvitation(req.params.eventId, req.body));
    },

    listItems(req, res) {
      res.json(service.listItems(req.params.eventId));
    },

    createItem(req, res) {
      res.status(201).json(service.createItem(req.params.eventId, req.body));
    },

    updateItem(req, res) {
      res.json(service.updateItem(req.params.eventId, req.params.itemId, req.body));
    },

    deleteItem(req, res) {
      service.deleteItem(req.params.eventId, req.params.itemId, req.body?.requesterId);
      res.status(204).send();
    },

    assignItem(req, res) {
      res.json(service.assignItem(req.params.eventId, req.params.itemId, req.body));
    },

    unassignItem(req, res) {
      res.json(service.unassignItem(req.params.eventId, req.params.itemId, req.body));
    },

    listMessages(req, res) {
      res.json(service.listMessages(req.params.eventId));
    },

    createMessage(req, res) {
      res.status(201).json(service.createMessage(req.params.eventId, req.body));
    },

    listHistory(req, res) {
      res.json(service.listHistory(req.params.eventId));
    
    },
  };
}

module.exports = {
  createEventController,
};