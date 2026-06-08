function createOpenApiSpec() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'EuLevo API',
      version: '1.0.0',
      description: 'API REST do EuLevo com autenticacao JWT, eventos, itens, participantes, chat e notificacoes.',
    },
    servers: [{ url: 'http://localhost:3333', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/health': { get: { summary: 'Health check', responses: { 200: { description: 'OK' } }, security: [] } },
      '/auth/login': {
        post: {
          summary: 'Login do usuario',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'eduardo@eulevo.app' },
                    password: { type: 'string', example: '123456' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login realizado com sucesso' },
            401: { description: 'Credenciais invalidas' },
          },
        },
      },
      '/auth/register': {
        post: {
          summary: 'Cria uma conta de usuario',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Novo Usuario' },
                    email: { type: 'string', example: 'novo@eulevo.app' },
                    password: { type: 'string', example: '123456' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Conta criada com sucesso' },
            409: { description: 'Email ja cadastrado' },
          },
        },
      },
      '/auth/recover-password': {
        post: {
          summary: 'Redefine a senha pelo email',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'newPassword'],
                  properties: {
                    email: { type: 'string', example: 'eduardo@eulevo.app' },
                    newPassword: { type: 'string', example: 'novaSenha123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Senha redefinida com sucesso' },
            404: { description: 'Conta nao encontrada' },
          },
        },
      },
      '/events': {
        get: {
          summary: 'Lista eventos do usuario',
          parameters: [{ name: 'userId', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Lista retornada' } },
        },
        post: {
          summary: 'Cria um evento',
          responses: { 201: { description: 'Evento criado' } },
        },
      },
      '/events/{eventId}/items/{itemId}/assign': {
        post: {
          summary: 'Assume responsabilidade por item',
          parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Item atribuido' }, 409: { description: 'Item ja assumido' } },
        },
      },
      '/events/{eventId}/history': {
        get: {
          summary: 'Historico do evento',
          parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Historico retornado' } },
        },
      },
      '/notifications': {
        get: {
          summary: 'Lista notificacoes por usuario',
          parameters: [{ name: 'userId', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Notificacoes retornadas' } },
        },
      },
      '/invitations': {
        get: {
          summary: 'Lista convites pendentes do usuario',
          parameters: [{ name: 'userId', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Convites retornados' } },
        },
      },
    },
  };
}

module.exports = {
  createOpenApiSpec,
};
