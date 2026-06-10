# Bolão Copa - Sistema Web Full Stack

Aplicação web para bolão dos jogos da Copa do Mundo, com back-end em Node.js, front-end em React, autenticação JWT, documentação Swagger e banco PostgreSQL.

## Repositório público

Após publicar no GitHub, inclua aqui o link do repositório:

`https://github.com/SEU_USUARIO/bolao-copa`

## Tecnologias

### Back-end
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT (`jsonwebtoken`)
- bcryptjs
- Zod
- Swagger (`swagger-jsdoc` + `swagger-ui-express`)

### Front-end
- React + Vite
- React Router
- Axios
- Bootstrap 5

## Estrutura do projeto

```
Bolao/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── config/
│       ├── middlewares/
│       ├── modules/
│       ├── routes/
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       └── services/
├── docker-compose.yml
└── README.md
```

## Organização do back-end

### Schema de dados
- `tipo_campanha`: tipos de campanha.
- `campanha`: campanhas com período, valores e status.
- `campanha_opcoes`: opções de aposta por campanha.
- `usuario`: usuários com perfil e autenticação.
- `meio_pagamento`: formas de pagamento.
- `aposta`: apostas vinculadas a usuário, opção e pagamento.

### Controllers
Organizados por módulo em `backend/src/modules/*`:
- `auth`, `usuarios`, `tiposCampanha`, `campanhas`, `opcoesCampanha`, `meiosPagamento`, `apostas`.

Cada controller delega regras para a camada `service`.

### Rotas
Centralizadas em `backend/src/routes/index.js`:
- `/api/auth`
- `/api/usuarios`
- `/api/tipos-campanha`
- `/api/campanhas`
- `/api/opcoes-campanha`
- `/api/meios-pagamento`
- `/api/apostas`
- `/api-docs` (Swagger)

### Regras de negócio implementadas
- `codigo_campanha`, `cpf` e `email` únicos.
- `dt_fim >= dt_inicio`.
- Aposta só em campanha aberta e dentro do período.
- Aposta só em opção ativa.
- Usuário inativo não aposta.
- Comprovante obrigatório quando o meio de pagamento exigir.
- Apenas uma opção final por campanha via endpoint administrativo.

## Como executar

### 1. Pré-requisitos
- Node.js 20+
- Docker Desktop (recomendado) ou PostgreSQL local

### 2. Subir banco
```bash
docker compose up -d
```

### 3. Back-end
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Back-end: `http://localhost:3333`
Swagger: `http://localhost:3333/api-docs`

### 4. Front-end
```bash
cd frontend
npm install
npm run dev
```

Front-end: `http://localhost:5173`

## Usuários de demonstração

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@bolao.com | admin123 |
| Usuário | joao@bolao.com | usuario123 |

## Testes de API

Use Swagger, Postman ou Insomnia.

Arquivo de coleção: `docs/bolao-copa.postman_collection.json`

Fluxo sugerido:
1. `POST /api/auth/login`
2. Copiar token JWT
3. Criar campanha/opção/aposta com header `Authorization: Bearer {token}`
4. Forçar erro tentando apostar em campanha encerrada

## Roteiro de apresentação

### Back-end
1. Mostrar organização por módulos (`modules`, `middlewares`, `routes`).
2. Explicar schema Prisma e relacionamentos do DER.
3. Demonstrar controllers finos e services com regras.
4. Apresentar Swagger em `/api-docs`.
5. Testar endpoints no Postman/Insomnia.

### Front-end
1. Explicar React + Vite + React Router.
2. Mostrar organização por `pages`, `components`, `services`, `context`.
3. Explicar agenda/período de campanha no dashboard.
4. Demonstrar:
   - cadastro de usuário;
   - criação de campanha e opção (admin);
   - criação de aposta;
   - perfil do usuário;
   - logout e tentativa de acesso a rota protegida;
   - mensagens de sucesso/erro;
   - botão “Forçar erro de validação” na área admin.

### Pontos fortes
- Arquitetura modular e clara.
- JWT + controle por perfil (`ADMIN` / `USUARIO`).
- Swagger documentado.
- Regras de negócio centralizadas nos services.
- Front-end com rotas protegidas e feedback visual.

### Pontos a melhorar
- Testes automatizados (Jest/Supertest).
- Refresh token e expiração mais robusta.
- Upload real de comprovante.
- Paginação e filtros nas listagens.
- Deploy em nuvem (Render, Railway, Vercel).

## Variáveis de ambiente

### backend/.env
```env
DATABASE_URL="postgresql://bolao:bolao123@localhost:5432/bolao_db?schema=public"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="8h"
PORT=3333
```

## Scripts úteis

Na raiz:
```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
npm run db:up
npm run db:migrate
npm run db:seed
```
