const now = Date.now();

export const createInitialState = () => ({
  currentUserId: null,
  users: [
    { id: 'u1', name: 'Eduardo Lima', email: 'eduardo@eulevo.app' },
    { id: 'u2', name: 'Paula Souza', email: 'paula@eulevo.app' },
    { id: 'u3', name: 'Marcos Dias', email: 'marcos@eulevo.app' },
    { id: 'u4', name: 'Lia Costa', email: 'lia@eulevo.app' },
  ],
  events: [
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
  ],
  items: [
    { id: 'i1', eventId: 'e1', name: 'Carvao', quantity: 2, assignedUserId: null },
    { id: 'i2', eventId: 'e1', name: 'Refrigerante', quantity: 6, assignedUserId: 'u2' },
    { id: 'i3', eventId: 'e1', name: 'Pao de alho', quantity: 4, assignedUserId: null },
    { id: 'i4', eventId: 'e2', name: 'Bolo', quantity: 1, assignedUserId: 'u4' },
  ],
  participants: [
    { userId: 'u1', eventId: 'e1' },
    { userId: 'u2', eventId: 'e1' },
    { userId: 'u3', eventId: 'e1' },
    { userId: 'u2', eventId: 'e2' },
    { userId: 'u1', eventId: 'e2' },
    { userId: 'u4', eventId: 'e2' },
  ],
  messages: [
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
  ],
  notifications: [
    {
      id: 'n1',
      eventId: 'e1',
      type: 'item_created',
      message: 'Novo item adicionado em Churrasco da Firma: Carvao',
      read: false,
      createdAt: new Date(now - 5 * 3600000).toISOString(),
    },
    {
      id: 'n2',
      eventId: 'e1',
      type: 'item_updated',
      message: 'Refrigerante foi assumido por Paula Souza',
      read: false,
      createdAt: new Date(now - 2 * 3600000).toISOString(),
    },
  ],
});
