# EuLevo Expo

Aplicativo `React Native + Expo` com backend local em `Express + SQLite`.

## Rodando o app

```bash
cd C:\Users\ntobi\Downloads\eulevo
npm install
copy .env.example .env
npx expo start --lan --clear
```

Depois escaneie o QR code no `Expo Go`.

Antes de abrir o app no celular, edite o arquivo `.env` na raiz e coloque o IP da sua maquina:

```text
EXPO_PUBLIC_API_URL=http://SEU_IP_NA_REDE:3333
```

## Acessos mock

- `eduardo@eulevo.app` / `123456`
- `paula@eulevo.app` / `123456`
- `marcos@eulevo.app` / `123456`
- `lia@eulevo.app` / `123456`

## Funcionalidades atuais

- Login
- Lista de eventos com bottom tabs
- Criacao e exclusao de eventos
- Itens disponiveis e confirmados
- Regra de apenas um responsavel por item
- Desmarcacao de item
- Participantes com convite apenas pelo organizador
- Protecao contra participante duplicado
- Chat por evento restrito a participantes
- Notificacoes agrupadas por evento
- Historico de marcacao e desmarcacao de itens

## Estrutura

```text
src/
|-- core/
|   |-- navigation/
|   |-- store/
|   |-- theme/
|   `-- utils/
|-- features/
|   |-- auth/
|   |-- chat/
|   |-- events/
|   `-- participants/
`-- shared/
    |-- components/
    `-- screens/
```

## Backend funcional

O projeto agora possui um backend local em [backend](</C:\Users\ntobi\Downloads\eulevo\backend>) com:

- `Express`
- `SQLite` persistente em `backend/data/eulevo.db`
- `JWT` para autenticacao
- `Swagger` em `/docs`
- seed inicial com os mesmos dados do app
- regras de negocio para eventos, itens, participantes, chat e notificacoes
- organizacao em `routes`, `controllers`, `services`, `middlewares` e `config`

### Rodando o backend

Pela pasta do backend:

```bash
cd C:\Users\ntobi\Downloads\eulevo\backend
npm install
copy .env.example .env
npm start
```

Ou pela raiz:

```bash
cd C:\Users\ntobi\Downloads\eulevo
npm run backend
```

O backend sobe em:

```text
http://localhost:3333
```

Swagger:

```text
http://localhost:3333/docs
```

### Banco persistido

O arquivo do banco fica em:

```text
backend/data/eulevo.db
```

Se quiser resetar tudo e recriar com seed, apague esse arquivo e suba o backend de novo.

### Endpoints principais

- `GET /health`
- `POST /auth/login`
- `GET /users/:userId`
- `GET /events?userId=u1`
- `POST /events`
- `GET /events/:eventId`
- `DELETE /events/:eventId`
- `GET /events/:eventId/participants`
- `POST /events/:eventId/participants`
- `GET /events/:eventId/items`
- `POST /events/:eventId/items`
- `PATCH /events/:eventId/items/:itemId`
- `POST /events/:eventId/items/:itemId/assign`
- `POST /events/:eventId/items/:itemId/unassign`
- `GET /events/:eventId/messages`
- `POST /events/:eventId/messages`
- `GET /notifications?userId=u1`
- `POST /notifications/read-all`
- `GET /events/:eventId/history`

Todas as rotas, exceto `GET /health` e `POST /auth/login`, exigem `Authorization: Bearer <token>`.

### Exemplos rapidos

Health check:

```bash
curl http://localhost:3333/health
```

Login:

```bash
curl -X POST http://localhost:3333/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"eduardo@eulevo.app\",\"password\":\"123456\"}"
```

Listar eventos do usuario `u1` com token:

```bash
curl "http://localhost:3333/events?userId=u1" ^
  -H "Authorization: Bearer SEU_TOKEN"
```

## Observacao sobre Expo Go

Se voce quiser plugar o app mobile nesse backend rodando no seu PC, o celular nao pode usar `localhost`. Ele precisa chamar o IP da sua maquina na rede local, por exemplo:

```text
http://192.168.0.10:3333
```

O app Expo agora consome essa API autenticada. Para funcionar no celular, `EXPO_PUBLIC_API_URL` precisa apontar para o IP do seu PC na rede local.

## Evolucao para producao

- trocar o store em memoria por consumo real da API
- persistir autenticacao com armazenamento seguro
- mover autorizacao e validacoes definitivamente para o backend
- subir o banco para Postgres ou outro banco gerenciado
- adicionar websocket para chat em tempo real
- integrar push notifications reais
