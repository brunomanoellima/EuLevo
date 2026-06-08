# EuLevo

Aplicativo mobile desenvolvido em `React Native + Expo`, com backend local em `Express + SQLite`.

O **EuLevo** é um aplicativo para organização colaborativa de eventos, permitindo criar grupos, convidar participantes, adicionar itens, assumir responsabilidades, conversar pelo chat e acompanhar notificações e histórico de alterações.

---

## Versão atual

```text
1.1.0
```

---

## Principais melhorias da versão 1.1.0

* Correção do sistema de convites.
* Convites agora aparecem como pendentes para o administrador.
* Participante convidado pode aceitar ou recusar convite.
* Correção da atualização do chat.
* Chat atualiza automaticamente.
* Correção da criação e atualização de itens em tempo quase real.
* Qualquer participante pode adicionar itens.
* Administrador pode excluir qualquer item.
* Participante pode excluir apenas itens criados por ele.
* Correção da exclusão de eventos para participantes.
* Correção da edição de perfil.
* Usuário pode alterar o nome do perfil.
* Nova interface visual com paleta azul e branca.
* Nova tela de login com logo do EuLevo.
* Ajustes na tela inicial, cards de eventos e botão “Ver grupo”.
* Tela de participantes com busca direta por usuários cadastrados.
* Alertas substituídos por modais com identidade visual do aplicativo.
* Logo adicionada ao projeto.

---

## Tecnologias utilizadas

### Aplicativo mobile

* React Native
* Expo
* JavaScript
* React Navigation
* Expo Vector Icons
* Expo Linear Gradient

### Backend

* Node.js
* Express
* SQLite
* JWT
* Swagger
* bcryptjs

---

## Rodando o app

Pela pasta raiz do projeto:

```bash
npm install
copy .env.example .env
npx expo start --lan --clear
```

Depois escaneie o QR Code no aplicativo **Expo Go**.

Antes de abrir o app no celular, edite o arquivo `.env` na raiz do projeto e coloque o IP da sua máquina:

```text
EXPO_PUBLIC_API_URL=http://SEU_IP_NA_REDE:3333
```

Exemplo:

```text
EXPO_PUBLIC_API_URL=http://192.168.0.10:3333
```

> Importante: no celular, não use `localhost`, pois o `localhost` aponta para o próprio celular. Use o IP do computador na rede local.

---

## Rodando o backend

Pela pasta do backend:

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Ou pela raiz do projeto:

```bash
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

Health check:

```text
http://localhost:3333/health
```

---

## Banco de dados

O projeto usa SQLite com banco persistente em:

```text
backend/data/eulevo.db
```

Para resetar o banco e recriar os dados iniciais, apague o arquivo:

```text
backend/data/eulevo.db
```

Depois inicie o backend novamente.

---

## Funcionalidades atuais

* Cadastro de usuário.
* Login com autenticação.
* Recuperação de senha.
* Listagem de eventos do usuário.
* Criação de eventos.
* Exclusão de eventos pelo criador.
* Visualização de detalhes do evento.
* Listagem de participantes.
* Convite de participantes por e-mail cadastrado.
* Indicação de convite pendente.
* Aceitar convite.
* Recusar convite.
* Proteção contra participante duplicado.
* Adição de itens por qualquer participante.
* Exclusão de itens com regra de permissão.
* Administrador exclui qualquer item.
* Participante exclui somente itens criados por ele.
* Regra de apenas um responsável por item.
* Assumir item.
* Desmarcar item.
* Chat por evento restrito aos participantes.
* Atualização automática do chat.
* Notificações agrupadas por evento.
* Histórico de criação, atualização e exclusão de itens.
* Edição de perfil com alteração de nome.
* Interface personalizada com identidade visual do EuLevo.

---

## Regras de negócio implementadas

* Apenas usuários autenticados acessam o app.
* Apenas o criador do evento pode excluir o evento.
* Apenas o organizador pode convidar participantes.
* O usuário convidado precisa estar cadastrado no app.
* Um usuário não pode ser convidado duas vezes para o mesmo evento com convite pendente.
* Um usuário que já participa do evento não pode ser convidado novamente.
* Apenas participantes podem acessar detalhes, itens e chat do evento.
* Cada item pode ter apenas um responsável.
* O responsável ou o organizador pode desmarcar um item.
* O administrador pode excluir qualquer item.
* O participante pode excluir apenas os itens que criou.
* O usuário só pode editar o próprio perfil.

---

## Estrutura do projeto

```text
src/
|-- core/
|   |-- api/
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

---

## Estrutura do backend

```text
backend/
|-- data/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- core/
|   |-- docs/
|   |-- middlewares/
|   |-- routes/
|   |-- seed/
|   |-- services/
|   |-- app.js
|   `-- server.js
|-- package.json
`-- .env.example
```

---

## Endpoints principais

### Saúde da API

* `GET /health`

### Autenticação

* `POST /auth/login`
* `POST /auth/register`
* `POST /auth/recover-password`

### Usuários

* `GET /users`
* `GET /users/:userId`
* `PATCH /users/:userId`

### Eventos

* `GET /events?userId=:userId`
* `POST /events`
* `GET /events/:eventId`
* `DELETE /events/:eventId`

### Participantes e convites

* `GET /events/:eventId/participants`
* `POST /events/:eventId/participants`
* `GET /events/:eventId/invitations`
* `GET /invitations?userId=:userId`
* `POST /invitations/:invitationId/accept`
* `POST /invitations/:invitationId/decline`

### Itens

* `GET /events/:eventId/items`
* `POST /events/:eventId/items`
* `PATCH /events/:eventId/items/:itemId`
* `DELETE /events/:eventId/items/:itemId`
* `POST /events/:eventId/items/:itemId/assign`
* `POST /events/:eventId/items/:itemId/unassign`

### Chat

* `GET /events/:eventId/messages`
* `POST /events/:eventId/messages`

### Notificações

* `GET /notifications?userId=:userId`
* `POST /notifications/read-all`

### Histórico

* `GET /events/:eventId/history`

Todas as rotas, exceto `GET /health`, `POST /auth/login`, `POST /auth/register` e `POST /auth/recover-password`, exigem:

```text
Authorization: Bearer <token>
```

---

## Exemplos rápidos

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

Listar eventos de um usuário com token:

```bash
curl "http://localhost:3333/events?userId=u1" ^
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## Observação sobre Expo Go

Durante o uso no **Expo Go**, pode aparecer uma tela de carregamento com:

```text
Bundling...
EuLevo
```

Essa tela pertence ao ambiente de desenvolvimento do Expo Go. Na build instalada do aplicativo, a splash screen usa a configuração definida em `app.json`.

---

## Limitações conhecidas

* O sistema ainda roda com backend local.
* A alta disponibilidade ainda não foi implementada.
* O backup automático ainda não foi implementado.
* O bloqueio temporário após 5 tentativas de login incorretas ainda precisa ser implementado.
* O chat atualiza por intervalo de tempo, não por WebSocket.
* Push notifications reais ainda não foram integradas.

---

## Próximos passos

* Implementar bloqueio temporário após 5 tentativas de login incorretas.
* Implementar backup automático do banco.
* Hospedar backend e banco em ambiente online.
* Substituir atualização por intervalo no chat por WebSocket.
* Integrar push notifications reais.
* Melhorar a splash screen e gerar build final do aplicativo.
* Criar versão de produção com APK/AAB.

---

## Status do projeto

```text
Versão: 1.1.0
Status: funcional em ambiente local
```
