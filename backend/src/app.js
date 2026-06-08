const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { createOpenApiSpec } = require('./docs/openapi');
const { createHealthRoutes } = require('./routes/health-routes');
const { createAuthRoutes } = require('./routes/auth-routes');
const { createUserRoutes } = require('./routes/user-routes');
const { createEventRoutes } = require('./routes/event-routes');
const { createNotificationRoutes } = require('./routes/notification-routes');
const { createInvitationRoutes } = require('./routes/invitation-routes');
const { createAuthController } = require('./controllers/auth-controller');
const { createUserController } = require('./controllers/user-controller');
const { createEventController } = require('./controllers/event-controller');
const { createNotificationController } = require('./controllers/notification-controller');
const { createInvitationController } = require('./controllers/invitation-controller');
const { errorHandler } = require('./middlewares/error-handler');

function createApp(service, corsOrigin) {
  const app = express();
  const authController = createAuthController(service);
  const userController = createUserController(service);
  const eventController = createEventController(service);
  const notificationController = createNotificationController(service);
  const invitationController = createInvitationController(service);

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.use('/health', createHealthRoutes());
  app.use('/auth', createAuthRoutes(authController));
  app.use('/users', createUserRoutes(userController));
  app.use('/events', createEventRoutes(eventController));
  app.use('/notifications', createNotificationRoutes(notificationController));
  app.use('/invitations', createInvitationRoutes(invitationController));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(createOpenApiSpec()));

  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
