import React, { createContext, useContext, useMemo, useState } from 'react';

import { apiRequest } from '../api/client';

const EuLevoContext = createContext(null);

const initialState = {
  token: null,
  currentUser: null,
  users: [],
  events: [],
  items: [],
  participants: [],
  messages: [],
  notifications: [],
  invitations: [],
  itemCreators: {},
  loading: false,
};

function uniqueById(list) {
  return Array.from(new Map(list.map((item) => [item.id, item])).values());
}

function mergeUsers(existing, incoming) {
  return uniqueById([...existing, ...incoming.filter(Boolean)]);
}

function replaceByEventId(collection, eventId, replacements) {
  return [
    ...collection.filter((entry) => entry.eventId !== eventId),
    ...replacements,
  ];
}

function getItemCreatorId(item) {
  return (
    item?.createdById ||
    item?.createdBy ||
    item?.creatorId ||
    item?.createdUserId ||
    item?.createdByUserId ||
    item?.ownerId ||
    item?.userId ||
    item?.authorId ||
    item?.participantId ||
    item?.createdBy?.id ||
    item?.creator?.id ||
    item?.user?.id ||
    item?.owner?.id ||
    item?.author?.id ||
    null
  );
}

function applyItemCreators(items, itemCreators = {}) {
  return items.map((item) => {
    const creatorId = getItemCreatorId(item) ?? itemCreators[item.id];

    if (!creatorId) return item;

    return {
      ...item,
      createdById: item.createdById ?? creatorId,
      createdBy: item.createdBy ?? creatorId,
      userId: item.userId ?? creatorId,
    };
  });
}

function extractItemCreators(items, fallback = {}) {
  const creators = { ...fallback };

  items.forEach((item) => {
    const creatorId = getItemCreatorId(item);

    if (item?.id && creatorId) {
      creators[item.id] = creatorId;
    }
  });

  return creators;
}

export function EuLevoProvider({ children }) {
  const [state, setState] = useState(initialState);

  const api = useMemo(() => {
    const setLoading = (loading) => {
      setState((previous) => ({ ...previous, loading }));
    };

    const withLoading = async (callback) => {
      setLoading(true);
      try {
        return await callback();
      } finally {
        setLoading(false);
      }
    };

    const request = (path, options = {}) =>
      apiRequest(path, {
        ...options,
        token: options.token ?? state.token,
      });

    const fetchEventBundle = async (eventId, tokenOverride) => {
      const [participants, items, messages, history] = await Promise.all([
        apiRequest(`/events/${eventId}/participants`, {
          token: tokenOverride ?? state.token,
        }),
        apiRequest(`/events/${eventId}/items`, {
          token: tokenOverride ?? state.token,
        }),
        apiRequest(`/events/${eventId}/messages`, {
          token: tokenOverride ?? state.token,
        }),
        apiRequest(`/events/${eventId}/history`, {
          token: tokenOverride ?? state.token,
        }),
      ]);

      return { participants, items, messages, history };
    };

    const refreshNotifications = async (userId) => {
      const notifications = await request(
        `/notifications?userId=${encodeURIComponent(userId)}`
      );

      setState((previous) => ({
        ...previous,
        notifications,
      }));

      return notifications;
    };

    const refreshInvitations = async (userId) => {
      const invitations = await request(
        `/invitations?userId=${encodeURIComponent(userId)}`
      );

      setState((previous) => ({
        ...previous,
        invitations,
      }));

      return invitations;
    };

    const bootstrapUserData = async ({ token, user }) => {
      const events = await apiRequest(
        `/events?userId=${encodeURIComponent(user.id)}`,
        { token }
      );

      const eventBundles = await Promise.all(
        events.map(async (event) => ({
          eventId: event.id,
          ...(await fetchEventBundle(event.id, token)),
        }))
      );

      const users = mergeUsers(
        [user],
        eventBundles.flatMap((bundle) => bundle.participants)
      );

      const participants = eventBundles.flatMap((bundle) =>
        bundle.participants.map((participant) => ({
          userId: participant.id,
          eventId: bundle.eventId,
        }))
      );

      const rawItems = eventBundles.flatMap((bundle) => bundle.items);
      const itemCreators = extractItemCreators(rawItems, state.itemCreators);
      const items = applyItemCreators(rawItems, itemCreators);

      const messages = eventBundles.flatMap((bundle) =>
        bundle.messages.map((message) => ({
          ...message,
          eventId: message.eventId ?? bundle.eventId,
        }))
      );

      const notifications = await apiRequest(
        `/notifications?userId=${encodeURIComponent(user.id)}`,
        { token }
      );

      const invitations = await apiRequest(
        `/invitations?userId=${encodeURIComponent(user.id)}`,
        { token }
      );

      setState({
        token,
        currentUser: user,
        users,
        events,
        items,
        participants,
        messages,
        notifications,
        invitations,
        itemCreators,
        loading: false,
      });
    };

    const refreshEventData = async (eventId) => {
      const event = await request(`/events/${eventId}`);
      const bundle = await fetchEventBundle(eventId);

      const itemCreators = extractItemCreators(bundle.items, state.itemCreators);
      const normalizedItems = applyItemCreators(bundle.items, itemCreators);

      const normalizedMessages = bundle.messages.map((message) => ({
        ...message,
        eventId: message.eventId ?? eventId,
      }));

      setState((previous) => ({
        ...previous,
        events: uniqueById([event, ...previous.events]),
        users: mergeUsers(previous.users, bundle.participants),
        participants: replaceByEventId(
          previous.participants,
          eventId,
          bundle.participants.map((participant) => ({
            userId: participant.id,
            eventId,
          }))
        ),
        items: replaceByEventId(previous.items, eventId, normalizedItems),
        messages: replaceByEventId(previous.messages, eventId, normalizedMessages),
        notifications: [
          ...previous.notifications.filter((entry) => entry.eventId !== eventId),
          ...bundle.history,
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        itemCreators: {
          ...previous.itemCreators,
          ...itemCreators,
        },
      }));

      if (state.currentUser?.id) {
        await refreshNotifications(state.currentUser.id);
        await refreshInvitations(state.currentUser.id);
      }

      return event;
    };

    const listEventsForCurrentUser = () => {
      if (!state.currentUser?.id) return [];

      const eventIds = new Set(
        state.participants
          .filter((entry) => entry.userId === state.currentUser.id)
          .map((entry) => entry.eventId)
      );

      return state.events.filter((event) => eventIds.has(event.id));
    };

    return {
      state,
      currentUser: state.currentUser,

      async signIn(email, password) {
        return withLoading(async () => {
          const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password },
          });

          await bootstrapUserData(response);
          return response.user;
        });
      },

      async signUp({ name, email, password }) {
        return withLoading(async () => {
          const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: { name, email, password },
          });

          return response;
        });
      },

      async recoverPassword({ email, newPassword }) {
        return withLoading(async () => {
          return apiRequest('/auth/recover-password', {
            method: 'POST',
            body: { email, newPassword },
          });
        });
      },

      async listRegisteredUsers(search = '') {
        return request(`/users?search=${encodeURIComponent(search)}`);
      },
async updateCurrentUserName(name) {
  return withLoading(async () => {
    const trimmedName = String(name ?? '').trim();

    if (!trimmedName) {
      throw new Error('Digite um nome para atualizar seu perfil.');
    }

    if (trimmedName.length < 3) {
      throw new Error('O nome deve ter pelo menos 3 caracteres.');
    }

    if (!state.currentUser?.id) {
      throw new Error('Usuário não encontrado.');
    }

    const updatedUser = await request(`/users/${state.currentUser.id}`, {
      method: 'PATCH',
      body: {
        name: trimmedName,
        requesterId: state.currentUser.id,
      },
    });

    setState((previous) => ({
      ...previous,

      currentUser: {
        ...previous.currentUser,
        name: updatedUser.name,
      },

      users: previous.users.map((user) =>
        String(user.id) === String(updatedUser.id)
          ? { ...user, ...updatedUser }
          : user
      ),
    }));

    return updatedUser;
  });
},
      async signOut() {
        setState(initialState);
      },

      listEventsForCurrentUser,

      getEventById(eventId) {
        return state.events.find((event) => event.id === eventId) ?? null;
      },

      participantsForEvent(eventId) {
        const ids = new Set(
          state.participants
            .filter((entry) => entry.eventId === eventId)
            .map((entry) => entry.userId)
        );

        return state.users.filter((user) => ids.has(user.id));
      },

      itemsForEvent(eventId) {
        const eventItems = state.items.filter((item) => item.eventId === eventId);
        return applyItemCreators(eventItems, state.itemCreators);
      },

      notificationsForCurrentUser() {
        return state.notifications
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      invitationsForCurrentUser() {
        return state.invitations
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      notificationsForEvent(eventId) {
        return state.notifications
          .filter((notification) => notification.eventId === eventId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      messagesForEvent(eventId) {
        return state.messages
          .filter((message) => message.eventId === eventId)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      },

      isParticipant(eventId, userId) {
        return state.participants.some(
          (entry) => entry.eventId === eventId && entry.userId === userId
        );
      },

      async createEvent({ name, description }) {
        return withLoading(async () => {
          const event = await request('/events', {
            method: 'POST',
            body: {
              ownerId: state.currentUser?.id,
              name,
              description,
            },
          });

          await refreshEventData(event.id);
          return event;
        });
      },

      async deleteEvent(eventId) {
        return withLoading(async () => {
          await request(`/events/${eventId}`, {
            method: 'DELETE',
            body: { requesterId: state.currentUser?.id },
          });

          setState((previous) => ({
            ...previous,
            events: previous.events.filter((entry) => entry.id !== eventId),
            participants: previous.participants.filter(
              (entry) => entry.eventId !== eventId
            ),
            items: previous.items.filter((entry) => entry.eventId !== eventId),
            messages: previous.messages.filter((entry) => entry.eventId !== eventId),
            notifications: previous.notifications.filter(
              (entry) => entry.eventId !== eventId
            ),
          }));

          if (state.currentUser?.id) {
            await refreshNotifications(state.currentUser.id);
            await refreshInvitations(state.currentUser.id);
          }
        });
      },

async createItem(eventId, { name, quantity }) {
  return withLoading(async () => {
    const creatorId = state.currentUser?.id;

    const previousItems = state.items.filter((item) => item.eventId === eventId);
    const previousItemIds = new Set(previousItems.map((item) => String(item.id)));

    const createdItem = await request(`/events/${eventId}/items`, {
      method: 'POST',
      body: {
        name,
        quantity: Number(quantity),
        requesterId: creatorId,
        createdById: creatorId,
        createdBy: creatorId,
        creatorId,
        userId: creatorId,
      },
    });

    const bundle = await fetchEventBundle(eventId);

    const newItem =
      createdItem?.id
        ? bundle.items.find((item) => String(item.id) === String(createdItem.id))
        : bundle.items.find((item) => !previousItemIds.has(String(item.id)));

    const newCreatorMap = {};

    if (creatorId && newItem?.id) {
      newCreatorMap[newItem.id] = creatorId;
    }

    const itemCreators = {
      ...state.itemCreators,
      ...newCreatorMap,
    };

    const normalizedItems = applyItemCreators(bundle.items, itemCreators);

    const normalizedMessages = bundle.messages.map((message) => ({
      ...message,
      eventId: message.eventId ?? eventId,
    }));

    setState((previous) => ({
      ...previous,
      users: mergeUsers(previous.users, bundle.participants),
      participants: replaceByEventId(
        previous.participants,
        eventId,
        bundle.participants.map((participant) => ({
          userId: participant.id,
          eventId,
        }))
      ),
      items: replaceByEventId(previous.items, eventId, normalizedItems),
      messages: replaceByEventId(previous.messages, eventId, normalizedMessages),
      notifications: [
        ...previous.notifications.filter((entry) => entry.eventId !== eventId),
        ...bundle.history,
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      itemCreators: {
        ...previous.itemCreators,
        ...newCreatorMap,
      },
    }));
  });
},

      async updateItem(eventId, itemId, { name, quantity }) {
        return withLoading(async () => {
          await request(`/events/${eventId}/items/${itemId}`, {
            method: 'PATCH',
            body: {
              name,
              quantity: Number(quantity),
              requesterId: state.currentUser?.id,
            },
          });

          await refreshEventData(eventId);
        });
      },

      async deleteItem(eventId, itemId) {
  return withLoading(async () => {
    try {
      await request(`/events/${eventId}/items/${itemId}`, {
        method: 'DELETE',
        body: {
          requesterId: state.currentUser?.id,
          userId: state.currentUser?.id,
        },
      });
    } catch (error) {
      console.log('Erro ao excluir item no servidor:', error.message);
      console.log('Removendo item apenas da tela por enquanto.');
    }

    setState((previous) => {
      const nextItemCreators = { ...previous.itemCreators };
      delete nextItemCreators[itemId];

      return {
        ...previous,
        items: previous.items.filter((item) => String(item.id) !== String(itemId)),
        notifications: previous.notifications.filter(
          (entry) => String(entry.itemId) !== String(itemId)
        ),
        itemCreators: nextItemCreators,
      };
    });

    try {
      await refreshEventData(eventId);
    } catch (error) {
      console.log('Erro ao atualizar evento depois de excluir:', error.message);
    }
  });
},

      async assignItem(eventId, itemId) {
        return withLoading(async () => {
          await request(`/events/${eventId}/items/${itemId}/assign`, {
            method: 'POST',
            body: { userId: state.currentUser?.id },
          });

          await refreshEventData(eventId);
        });
      },

      async unassignItem(eventId, itemId) {
        return withLoading(async () => {
          await request(`/events/${eventId}/items/${itemId}/unassign`, {
            method: 'POST',
            body: { requesterId: state.currentUser?.id },
          });

          await refreshEventData(eventId);
        });
      },

      async addParticipant(eventId, { name, email }) {
        return withLoading(async () => {
          await request(`/events/${eventId}/participants`, {
            method: 'POST',
            body: {
              organizerId: state.currentUser?.id,
              email,
            },
          });

          if (state.currentUser?.id) {
            await refreshInvitations(state.currentUser.id);
          }
        });
      },
async listPendingInvitationsForEvent(eventId) {
  if (!state.currentUser?.id) return [];

  return request(
    `/events/${eventId}/invitations?requesterId=${encodeURIComponent(state.currentUser.id)}`
  );
},
      async sendMessage(eventId, content) {
        const trimmedContent = content?.trim();

        if (!trimmedContent) {
          throw new Error('Digite uma mensagem antes de enviar.');
        }

        return withLoading(async () => {
          await request(`/events/${eventId}/messages`, {
            method: 'POST',
            body: {
              userId: state.currentUser?.id,
              content: trimmedContent,
            },
          });

          const messages = await request(`/events/${eventId}/messages`);

          const normalizedMessages = messages.map((message) => ({
            ...message,
            eventId: message.eventId ?? eventId,
          }));

          setState((previous) => ({
            ...previous,
            messages: replaceByEventId(
              Array.isArray(previous.messages) ? previous.messages : [],
              eventId,
              normalizedMessages
            ),
          }));
        });
      },

      async refreshMessagesForEvent(eventId) {
        if (!eventId) return [];

        try {
          const messages = await request(
            `/events/${encodeURIComponent(eventId)}/messages`
          );

          const normalizedMessages = messages.map((message) => ({
            ...message,
            eventId: message.eventId ?? eventId,
          }));

          setState((previous) => ({
            ...previous,
            messages: replaceByEventId(
              Array.isArray(previous.messages) ? previous.messages : [],
              eventId,
              normalizedMessages
            ),
          }));

          return normalizedMessages;
        } catch (error) {
          console.log('Erro ao atualizar mensagens:', error.message);
          return [];
        }
      },

      async markNotificationsRead() {
        return withLoading(async () => {
          await request('/notifications/read-all', {
            method: 'POST',
            body: { userId: state.currentUser?.id },
          });

          if (state.currentUser?.id) {
            await refreshNotifications(state.currentUser.id);
          }
        });
      },

      async acceptInvitation(invitationId) {
        return withLoading(async () => {
          await request(`/invitations/${invitationId}/accept`, {
            method: 'POST',
            body: { userId: state.currentUser?.id },
          });

          if (state.currentUser?.id) {
            await bootstrapUserData({
              token: state.token,
              user: state.currentUser,
            });
          }
        });
      },

      async declineInvitation(invitationId) {
        return withLoading(async () => {
          await request(`/invitations/${invitationId}/decline`, {
            method: 'POST',
            body: { userId: state.currentUser?.id },
          });

          if (state.currentUser?.id) {
            await refreshInvitations(state.currentUser.id);
          }
        });
      },

      async refreshCurrentUserData() {
        if (!state.currentUser?.id || !state.token) return;

        return withLoading(async () => {
          await bootstrapUserData({
            token: state.token,
            user: state.currentUser,
          });
        });
      },

      async refreshInvitationsForCurrentUser() {
        if (!state.currentUser?.id) return [];

        return withLoading(async () => {
          const invitations = await request(
            `/invitations?userId=${encodeURIComponent(state.currentUser.id)}`
          );

          const notifications = await request(
            `/notifications?userId=${encodeURIComponent(state.currentUser.id)}`
          );

          setState((previous) => ({
            ...previous,
            invitations,
            notifications,
          }));

          return invitations;
        });
      },
    };
  }, [state]);

  return <EuLevoContext.Provider value={api}>{children}</EuLevoContext.Provider>;
}

export function useEuLevo() {
  const value = useContext(EuLevoContext);

  if (!value) {
    throw new Error('useEuLevo must be used inside EuLevoProvider');
  }

  return value;
}