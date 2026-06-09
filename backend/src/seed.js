const bcrypt = require('bcryptjs');

const now = Date.now();

function seedDatabase(db) {
  const existingUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;

  if (existingUsers > 0) {
    return;
  }

  const insertUser = db.prepare(
    'INSERT INTO users (id, name, email, password) VALUES (@id, @name, @email, @password)'
  );

  const insertEvent = db.prepare(
    'INSERT INTO events (id, name, description, date, owner_id) VALUES (@id, @name, @description, @date, @ownerId)'
  );

  const insertParticipant = db.prepare(
    'INSERT INTO participants (event_id, user_id) VALUES (@eventId, @userId)'
  );

  const insertItem = db.prepare(
    'INSERT INTO items (id, event_id, name, quantity, assigned_user_id) VALUES (@id, @eventId, @name, @quantity, @assignedUserId)'
  );

  const insertMessage = db.prepare(
    'INSERT INTO messages (id, event_id, user_id, content, timestamp) VALUES (@id, @eventId, @userId, @content, @timestamp)'
  );

  const insertNotification = db.prepare(
    'INSERT INTO notifications (id, event_id, type, message, read, created_at) VALUES (@id, @eventId, @type, @message, @read, @createdAt)'
  );

  const users = [
    {
      id: 'u1',
      name: 'João Silva',
      email: 'joao@email.com',
      password: bcrypt.hashSync('123456', 10),
    },
    {
      id: 'u2',
      name: 'Paula Souza',
      email: 'paula@email.com',
      password: bcrypt.hashSync('123456', 10),
    },
    {
      id: 'u3',
      name: 'Carlos Lima',
      email: 'carlos@email.com',
      password: bcrypt.hashSync('123456', 10),
    },
    {
      id: 'u4',
      name: 'Ana Costa',
      email: 'ana@email.com',
      password: bcrypt.hashSync('123456', 10),
    },
  ];

  const events = [
    {
      id: 'e1',
      name: 'Churrasco da Firma',
      description: 'Encontro de confraternizacao no sabado.',
      date: new Date(now + 2 * 86400000).toISOString(),
      ownerId: 'u1',
    },
    {
      id: 'e2',
      name: 'Aniversario da Ana',
      description: 'Comidas, bebidas e decoracao compartilhada.',
      date: new Date(now + 7 * 86400000).toISOString(),
      ownerId: 'u2',
    },
  ];

  const participants = [
    { userId: 'u1', eventId: 'e1' },
    { userId: 'u2', eventId: 'e1' },
    { userId: 'u3', eventId: 'e1' },
    { userId: 'u2', eventId: 'e2' },
    { userId: 'u1', eventId: 'e2' },
    { userId: 'u4', eventId: 'e2' },
  ];

  const items = [
    {
      id: 'i1',
      eventId: 'e1',
      name: 'Carvao',
      quantity: 2,
      assignedUserId: null,
    },
    {
      id: 'i2',
      eventId: 'e1',
      name: 'Refrigerante',
      quantity: 6,
      assignedUserId: 'u2',
    },
    {
      id: 'i3',
      eventId: 'e1',
      name: 'Pao de alho',
      quantity: 4,
      assignedUserId: null,
    },
    {
      id: 'i4',
      eventId: 'e2',
      name: 'Bolo',
      quantity: 1,
      assignedUserId: 'u4',
    },
  ];

  const messages = [
    {
      id: 'm1',
      eventId: 'e1',
      userId: 'u2',
      content: 'Levo os refrigerantes.',
      timestamp: new Date(now - 3 * 3600000).toISOString(),
    },
    {
      id: 'm2',
      eventId: 'e1',
      userId: 'u1',
      content: 'Perfeito. Vou cuidar da carne.',
      timestamp: new Date(now - 2.5 * 3600000).toISOString(),
    },
  ];

  const notifications = [
    {
      id: 'n1',
      eventId: 'e1',
      type: 'item_created',
      message: 'Novo item adicionado em Churrasco da Firma: Carvao',
      read: 0,
      createdAt: new Date(now - 5 * 3600000).toISOString(),
    },
    {
      id: 'n2',
      eventId: 'e1',
      type: 'item_updated',
      message: 'Refrigerante foi assumido por Paula Souza',
      read: 0,
      createdAt: new Date(now - 2 * 3600000).toISOString(),
    },
  ];

  const transaction = db.transaction(() => {
    users.forEach((user) => insertUser.run(user));

    events.forEach((event) => insertEvent.run(event));

    participants.forEach((participant) => {
      insertParticipant.run({
        eventId: participant.eventId,
        userId: participant.userId,
      });
    });

    items.forEach((item) => insertItem.run(item));

    messages.forEach((message) => insertMessage.run(message));

    notifications.forEach((notification) =>
      insertNotification.run(notification)
    );
  });

  transaction();
}

module.exports = {
  seedDatabase,
};
