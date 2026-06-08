const { config } = require('./config/env');
const { initDatabase, openDatabase } = require('./db');
const { seedDatabase } = require('./seed');
const { EuLevoService } = require('./services/eulevo-service');
const { createApp } = require('./app');

const db = openDatabase();
initDatabase(db);
seedDatabase(db);

const service = new EuLevoService(db);
const app = createApp(service, config.corsOrigin);

app.listen(config.port, () => {
  console.log(`EuLevo backend listening on http://localhost:${config.port}`);
  console.log(`Swagger docs on http://localhost:${config.port}/docs`);
});
