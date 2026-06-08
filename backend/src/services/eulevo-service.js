const { randomUUID } = require('node:crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { config } = require('../config/env');
const { badRequest, conflict, forbidden, notFound, unauthorized } = require('../core/http-error');
const { requirePositiveNumber, requireText } = require('../core/validators');

class EuLevoService {
  constructor(db) {
    this.db = db;
    this.ensureItemsCreatedByColumn();
  }

  ensureItemsCreatedByColumn() {
    const columns = this.db.prepare('PRAGMA table_info(items)').all();
    const hasCreatedByColumn = columns.some((column) => column.name === 'created_by_user_id');

    if (!hasCreatedByColumn) {
      this.db.prepare('ALTER TABLE items ADD COLUMN created_by_user_id TEXT').run();
    }
  }

  createNotification(eventId, type, message) {
    this.db
      .prepare(
        'INSERT INTO notifications (id, event_id, type, message, read, created_at) VALUES (?, ?, ?, ?, 0, ?)'
      )
      .run(randomUUID(), eventId, type, message, new Date().toISOString());
  }

  getUserById(userId) {
    const user = this.db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId);
    if (!user) throw notFound('Usuario nao encontrado.');
    return user;
  }

  listUsers(search = '') {
    const term = `%${String(search).trim().toLowerCase()}%`;
    return this.db
      .prepare(
        `
        SELECT id, name, email
        FROM users
        WHERE lower(name) LIKE ? OR lower(email) LIKE ?
        ORDER BY name ASC
      `
      )
      .all(term, term);
  }

  updateUser(userId, payload) {
    const requesterId = requireText(payload?.requesterId, 'Informe requesterId.');

    if (String(userId) !== String(requesterId)) {
      throw forbidden('Voce so pode editar o proprio perfil.');
    }

    const name = requireText(payload?.name, 'Informe o nome.');

    if (name.length < 3) {
      throw badRequest('O nome deve ter pelo menos 3 caracteres.');
    }

    this.getUserById(userId);

    this.db
      .prepare('UPDATE users SET name = ? WHERE id = ?')
      .run(name, userId);

    return this.getUserById(userId);
  }

  getUserWithPasswordByEmail(email) {
    return this.db
      .prepare('SELECT id, name, email, password FROM users WHERE lower(email) = lower(?)')
      .get(email);
  }

  getEventById(eventId) {
    const event = this.db
      .prepare('SELECT id, name, description, date, owner_id AS ownerId FROM events WHERE id = ?')
      .get(eventId);

    if (!event) throw notFound('Evento nao encontrado.');
    return event;
  }

  getInvitationById(invitationId) {
    const invitation = this.db
      .prepare(
        `
        SELECT i.id, i.event_id AS eventId, i.email, i.invited_user_id AS invitedUserId,
               i.invited_by_user_id AS invitedByUserId, i.status, i.created_at AS createdAt,
               e.name AS eventName, inviter.name AS invitedByName
        FROM invitations i
        INNER JOIN events e ON e.id = i.event_id
        INNER JOIN users inviter ON inviter.id = i.invited_by_user_id
        WHERE i.id = ?
      `
      )
      .get(invitationId);

    if (!invitation) throw notFound('Convite nao encontrado.');
    return invitation;
  }

  getItemById(itemId) {
    const item = this.db
      .prepare(
        `
        SELECT id,
               event_id AS eventId,
               name,
               quantity,
               assigned_user_id AS assignedUserId,
               created_by_user_id AS createdById
        FROM items
        WHERE id = ?
        `
      )
      .get(itemId);

    if (!item) throw notFound('Item nao encontrado.');
    return item;
  }

  assertParticipant(eventId, userId) {
    const exists = this.db
      .prepare('SELECT 1 FROM participants WHERE event_id = ? AND user_id = ?')
      .get(eventId, userId);

    if (!exists) {
      throw forbidden('Apenas participantes podem acessar este evento.');
    }
  }

  issueToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  verifyPassword(password, storedPassword) {
    if (!storedPassword) {
      return false;
    }

    if (
      storedPassword.startsWith('$2a$') ||
      storedPassword.startsWith('$2b$') ||
      storedPassword.startsWith('$2y$')
    ) {
      return bcrypt.compareSync(password, storedPassword);
    }

    return password === storedPassword;
  }

  login(payload) {
    const email = requireText(payload?.email, 'Informe o email.');
    const password = requireText(payload?.password, 'Informe a senha.');

    if (password.length < 6) {
      throw badRequest('A senha deve ter ao menos 6 caracteres.');
    }

    const user = this.getUserWithPasswordByEmail(email);

    if (!user || !this.verifyPassword(password, user.password)) {
      throw unauthorized('Email ou senha invalidos.');
    }

    if (user.password === password) {
      const hashedPassword = this.hashPassword(password);
      this.db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user.id);
    }

    return {
      token: this.issueToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  register(payload) {
    const name = requireText(payload?.name, 'Informe o nome.');
    const email = requireText(payload?.email, 'Informe o email.').toLowerCase();
    const password = requireText(payload?.password, 'Informe a senha.');

    if (name.length < 3) {
      throw badRequest('O nome deve ter ao menos 3 caracteres.');
    }

    if (password.length < 6) {
      throw badRequest('A senha deve ter ao menos 6 caracteres.');
    }

    const existingUser = this.getUserWithPasswordByEmail(email);

    if (existingUser) {
      throw conflict('Ja existe uma conta cadastrada com este email.');
    }

    const newUser = {
      id: randomUUID(),
      name,
      email,
      password: this.hashPassword(password),
    };

    this.db
      .prepare('INSERT INTO users (id, name, email, password) VALUES (@id, @name, @email, @password)')
      .run(newUser);

    return {
      message: 'Conta criada com sucesso.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  recoverPassword(payload) {
    const email = requireText(payload?.email, 'Informe o email.').toLowerCase();
    const newPassword = requireText(payload?.newPassword, 'Informe a nova senha.');

    if (newPassword.length < 6) {
      throw badRequest('A nova senha deve ter ao menos 6 caracteres.');
    }

    const user = this.getUserWithPasswordByEmail(email);

    if (!user) {
      throw notFound('Nao existe conta cadastrada com este email.');
    }

    this.db
      .prepare('UPDATE users SET password = ? WHERE id = ?')
      .run(this.hashPassword(newPassword), user.id);

    return {
      message: 'Senha atualizada com sucesso.',
    };
  }

  listEventsForUser(userId) {
    this.getUserById(userId);

    return this.db
      .prepare(
        `
        SELECT e.id, e.name, e.description, e.date, e.owner_id AS ownerId
        FROM events e
        INNER JOIN participants p ON p.event_id = e.id
        WHERE p.user_id = ?
        ORDER BY e.date ASC
      `
      )
      .all(userId);
  }

  createEvent(payload) {
    const ownerId = requireText(payload?.ownerId, 'Informe ownerId.');
    this.getUserById(ownerId);

    const name = requireText(payload?.name, 'O nome do evento e obrigatorio.');

    if (name.length < 3 || name.length > 100) {
      throw badRequest('O nome do evento deve ter entre 3 e 100 caracteres.');
    }

    const event = {
      id: randomUUID(),
      name,
      description: typeof payload?.description === 'string' ? payload.description.trim() : '',
      date: new Date(Date.now() + 5 * 86400000).toISOString(),
      ownerId,
    };

    const transaction = this.db.transaction(() => {
      this.db
        .prepare(
          'INSERT INTO events (id, name, description, date, owner_id) VALUES (@id, @name, @description, @date, @ownerId)'
        )
        .run(event);

      this.db
        .prepare('INSERT INTO participants (event_id, user_id) VALUES (?, ?)')
        .run(event.id, ownerId);
    });

    transaction();

    return event;
  }

  deleteEvent(eventId, requesterId) {
    const event = this.getEventById(eventId);

    if (event.ownerId !== requesterId) {
      throw forbidden('Apenas o criador pode excluir este evento.');
    }

    this.db.prepare('DELETE FROM events WHERE id = ?').run(event.id);
  }

  listParticipants(eventId) {
    this.getEventById(eventId);

    return this.db
      .prepare(
        `
        SELECT u.id, u.name, u.email
        FROM participants p
        INNER JOIN users u ON u.id = p.user_id
        WHERE p.event_id = ?
        ORDER BY u.name ASC
      `
      )
      .all(eventId);
  }

  createInvitation(eventId, payload) {
    const event = this.getEventById(eventId);
    const organizerId = requireText(payload?.organizerId, 'Informe organizerId.');

    if (event.ownerId !== organizerId) {
      throw forbidden('Apenas o organizador pode convidar participantes.');
    }

    const email = requireText(payload?.email, 'Informe o email.').toLowerCase();

    const user = this.db
      .prepare('SELECT id, name, email FROM users WHERE lower(email) = lower(?)')
      .get(email);

    if (!user) {
      throw notFound('O usuario convidado precisa ja estar cadastrado no app.');
    }

    const participantExists = this.db
      .prepare('SELECT 1 FROM participants WHERE event_id = ? AND user_id = ?')
      .get(event.id, user.id);

    if (participantExists) {
      throw conflict('Este usuario ja participa do evento.');
    }

    const pendingInvitation = this.db
      .prepare(
        "SELECT 1 FROM invitations WHERE event_id = ? AND invited_user_id = ? AND status = 'pending'"
      )
      .get(event.id, user.id);

    if (pendingInvitation) {
      throw conflict('Ja existe um convite pendente para este usuario.');
    }

    const invitation = {
      id: randomUUID(),
      eventId: event.id,
      email,
      invitedUserId: user.id,
      invitedByUserId: organizerId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.db
      .prepare(
        'INSERT INTO invitations (id, event_id, email, invited_user_id, invited_by_user_id, status, created_at) VALUES (@id, @eventId, @email, @invitedUserId, @invitedByUserId, @status, @createdAt)'
      )
      .run(invitation);

    return {
      ...invitation,
      eventName: event.name,
      invitedByName: this.getUserById(organizerId).name,
      invitedUserName: user.name,
    };
  }

  listEventInvitations(eventId, requesterId) {
    const event = this.getEventById(eventId);
    const currentRequesterId = requireText(requesterId, 'Informe requesterId.');

    if (String(event.ownerId) !== String(currentRequesterId)) {
      throw forbidden('Apenas o organizador pode visualizar os convites deste evento.');
    }

    return this.db
      .prepare(
        `
        SELECT i.id,
               i.event_id AS eventId,
               i.email,
               i.invited_user_id AS invitedUserId,
               i.invited_by_user_id AS invitedByUserId,
               i.status,
               i.created_at AS createdAt,
               u.name AS invitedUserName,
               u.email AS invitedUserEmail
        FROM invitations i
        INNER JOIN users u ON u.id = i.invited_user_id
        WHERE i.event_id = ?
          AND i.status = 'pending'
        ORDER BY i.created_at DESC
        `
      )
      .all(event.id);
  }

  listInvitationsForUser(userId) {
    this.getUserById(userId);

    return this.db
      .prepare(
        `
        SELECT i.id, i.event_id AS eventId, i.email, i.invited_user_id AS invitedUserId,
               i.invited_by_user_id AS invitedByUserId, i.status, i.created_at AS createdAt,
               e.name AS eventName, inviter.name AS invitedByName
        FROM invitations i
        INNER JOIN events e ON e.id = i.event_id
        INNER JOIN users inviter ON inviter.id = i.invited_by_user_id
        WHERE i.invited_user_id = ? AND i.status = 'pending'
        ORDER BY i.created_at DESC
      `
      )
      .all(userId);
  }

  acceptInvitation(invitationId, userId) {
    const invitation = this.getInvitationById(invitationId);

    if (invitation.invitedUserId !== userId) {
      throw forbidden('Voce nao pode aceitar este convite.');
    }

    if (invitation.status !== 'pending') {
      throw conflict('Este convite ja foi processado.');
    }

    const alreadyParticipant = this.db
      .prepare('SELECT 1 FROM participants WHERE event_id = ? AND user_id = ?')
      .get(invitation.eventId, userId);

    const transaction = this.db.transaction(() => {
      if (!alreadyParticipant) {
        this.db
          .prepare('INSERT INTO participants (event_id, user_id) VALUES (?, ?)')
          .run(invitation.eventId, userId);
      }

      this.db.prepare("UPDATE invitations SET status = 'accepted' WHERE id = ?").run(invitationId);
    });

    transaction();

    return { ok: true };
  }

  declineInvitation(invitationId, userId) {
    const invitation = this.getInvitationById(invitationId);

    if (invitation.invitedUserId !== userId) {
      throw forbidden('Voce nao pode recusar este convite.');
    }

    if (invitation.status !== 'pending') {
      throw conflict('Este convite ja foi processado.');
    }

    this.db.prepare("UPDATE invitations SET status = 'declined' WHERE id = ?").run(invitationId);

    return { ok: true };
  }

  listItems(eventId) {
    this.getEventById(eventId);

    return this.db
      .prepare(
        `
        SELECT id,
               event_id AS eventId,
               name,
               quantity,
               assigned_user_id AS assignedUserId,
               created_by_user_id AS createdById
        FROM items
        WHERE event_id = ?
        ORDER BY name ASC
        `
      )
      .all(eventId);
  }

  createItem(eventId, payload) {
    const event = this.getEventById(eventId);

    const requesterId =
      payload?.requesterId ||
      payload?.createdById ||
      payload?.createdBy ||
      payload?.creatorId ||
      payload?.userId;

    const createdById = requireText(requesterId, 'Informe requesterId.');
    this.getUserById(createdById);
    this.assertParticipant(event.id, createdById);

    const name = requireText(payload?.name, 'O nome do item e obrigatorio.');
    const quantity = requirePositiveNumber(payload?.quantity, 'A quantidade deve ser maior que zero.');

    const item = {
      id: randomUUID(),
      eventId: event.id,
      name,
      quantity,
      assignedUserId: null,
      createdById,
    };

    this.db
      .prepare(
        `
        INSERT INTO items (id, event_id, name, quantity, assigned_user_id, created_by_user_id)
        VALUES (@id, @eventId, @name, @quantity, @assignedUserId, @createdById)
        `
      )
      .run(item);

    this.createNotification(event.id, 'item_created', `Novo item adicionado em ${event.name}: ${item.name}`);

    return item;
  }

  updateItem(eventId, itemId, payload) {
    const event = this.getEventById(eventId);
    const item = this.getItemById(itemId);

    if (item.eventId !== event.id) {
      throw notFound('Item nao encontrado neste evento.');
    }

    const name = requireText(payload?.name, 'O nome do item e obrigatorio.');
    const quantity = requirePositiveNumber(payload?.quantity, 'A quantidade deve ser maior que zero.');

    this.db.prepare('UPDATE items SET name = ?, quantity = ? WHERE id = ?').run(name, quantity, itemId);

    this.createNotification(event.id, 'item_updated', `Item atualizado: ${name}`);

    return this.getItemById(itemId);
  }

  deleteItem(eventId, itemId, requesterId) {
    const event = this.getEventById(eventId);
    const item = this.getItemById(itemId);

    const currentRequesterId = requireText(requesterId, 'Informe requesterId.');
    this.getUserById(currentRequesterId);
    this.assertParticipant(event.id, currentRequesterId);

    if (item.eventId !== event.id) {
      throw notFound('Item nao encontrado neste evento.');
    }

    const isEventOwner = String(event.ownerId) === String(currentRequesterId);
    const isItemCreator = String(item.createdById) === String(currentRequesterId);

    if (!isEventOwner && !isItemCreator) {
      throw forbidden('Voce so pode excluir itens criados por voce.');
    }

    this.db.prepare('DELETE FROM items WHERE id = ?').run(item.id);

    this.createNotification(event.id, 'item_deleted', `Item excluido: ${item.name}`);

    return { ok: true };
  }

  assignItem(eventId, itemId, payload) {
    const event = this.getEventById(eventId);
    const userId = requireText(payload?.userId, 'Informe userId.');
    const user = this.getUserById(userId);

    this.assertParticipant(event.id, userId);

    const item = this.getItemById(itemId);

    if (item.eventId !== event.id) {
      throw notFound('Item nao encontrado neste evento.');
    }

    if (item.assignedUserId && item.assignedUserId !== userId) {
      throw conflict('Este item ja possui um responsavel.');
    }

    this.db.prepare('UPDATE items SET assigned_user_id = ? WHERE id = ?').run(userId, item.id);

    this.createNotification(event.id, 'item_updated', `${item.name} foi assumido por ${user.name}`);

    return this.getItemById(item.id);
  }

  unassignItem(eventId, itemId, payload) {
    const event = this.getEventById(eventId);
    const requesterId = requireText(payload?.requesterId, 'Informe requesterId.');
    const item = this.getItemById(itemId);

    if (item.eventId !== event.id) {
      throw notFound('Item nao encontrado neste evento.');
    }

    if (item.assignedUserId !== requesterId && event.ownerId !== requesterId) {
      throw forbidden('Apenas o responsavel ou organizador pode desmarcar este item.');
    }

    this.db.prepare('UPDATE items SET assigned_user_id = NULL WHERE id = ?').run(item.id);

    this.createNotification(event.id, 'item_updated', `${item.name} voltou para itens disponiveis`);

    return this.getItemById(item.id);
  }

  listMessages(eventId) {
    this.getEventById(eventId);

    return this.db
      .prepare(
        `
        SELECT m.id, m.event_id AS eventId, m.user_id AS userId, m.content, m.timestamp
        FROM messages m
        WHERE m.event_id = ?
        ORDER BY m.timestamp ASC
      `
      )
      .all(eventId);
  }

  createMessage(eventId, payload) {
    const event = this.getEventById(eventId);
    const userId = requireText(payload?.userId, 'Informe userId.');
    const content = requireText(payload?.content, 'A mensagem nao pode ficar vazia.');

    this.getUserById(userId);
    this.assertParticipant(event.id, userId);

    const message = {
      id: randomUUID(),
      eventId: event.id,
      userId,
      content,
      timestamp: new Date().toISOString(),
    };

    this.db
      .prepare(
        'INSERT INTO messages (id, event_id, user_id, content, timestamp) VALUES (@id, @eventId, @userId, @content, @timestamp)'
      )
      .run(message);

    return message;
  }

  listNotifications(userId) {
    this.getUserById(userId);

    return this.db
      .prepare(
        `
        SELECT n.id, n.event_id AS eventId, n.type, n.message, n.read, n.created_at AS createdAt
        FROM notifications n
        WHERE n.event_id IN (
          SELECT event_id FROM participants WHERE user_id = ?
        )
        ORDER BY n.created_at DESC
      `
      )
      .all(userId)
      .map((entry) => ({ ...entry, read: Boolean(entry.read) }));
  }

  markNotificationsRead(userId) {
    this.getUserById(userId);

    this.db
      .prepare(
        `
        UPDATE notifications
        SET read = 1
        WHERE event_id IN (
          SELECT event_id FROM participants WHERE user_id = ?
        )
      `
      )
      .run(userId);

    return { ok: true };
  }

  listHistory(eventId) {
    this.getEventById(eventId);

    return this.db
      .prepare(
        `
        SELECT id, event_id AS eventId, type, message, read, created_at AS createdAt
        FROM notifications
        WHERE event_id = ? AND type IN ('item_created', 'item_updated', 'item_deleted')
        ORDER BY created_at DESC
      `
      )
      .all(eventId)
      .map((entry) => ({ ...entry, read: Boolean(entry.read) }));
  }
}

module.exports = {
  EuLevoService,
};