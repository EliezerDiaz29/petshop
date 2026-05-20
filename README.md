# Petshop Backend

Backend completo para um sistema de petshop com Node.js, Express, Sequelize, MySQL, Swagger, Axios e autenticacao JWT.

O projeto tambem possui um frontend desenvolvido com React e Vite para consumo da API, gerenciamento visual do sistema e navegacao entre as funcionalidades do petshop.

## O que o projeto faz

Esta API permite:

- autenticar usuarios com JWT
- gerenciar donos dos pets
- gerenciar pets e seus vinculos com donos
- gerenciar tipos de servico do petshop
- registrar servicos realizados
- consultar CEP via integracao externa com Axios
- acessar documentacao interativa via Swagger

O frontend permite:

- realizar login no sistema
- navegar entre paginas utilizando React Router
- visualizar dashboard do sistema
- gerenciar donos dos pets
- gerenciar pets cadastrados
- consumir os endpoints da API
- organizacao modular por paginas e servicos
- interface SPA utilizando React + Vite

---

# Tecnologias utilizadas

## Backend

- Node.js
- Express.js
- Sequelize
- MySQL
- Swagger UI Express
- Axios
- express-validator
- JWT com `jsonwebtoken`
- Hash de senha com `bcryptjs`

## Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS modularizado
- Context API

---

# Estrutura do projeto

```text
.
|-- database/
|   `-- init.sql
|
|-- frontend/
|   |-- public/
|   |
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- layouts/
|   |   |
|   |   |-- pages/
|   |   |   |-- Dashboard/
|   |   |   |-- Login/
|   |   |   |-- Owner/
|   |   |   `-- Pets/
|   |   |
|   |   |-- routes/
|   |   |-- services/
|   |   |-- styles/
|   |   |
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- database/
|   |   |-- config/
|   |   |-- migrations/
|   |   `-- seeders/
|   |-- docs/
|   |-- middlewares/
|   |-- models/
|   |-- repositories/
|   |-- routes/
|   |-- scripts/
|   |-- services/
|   |-- utils/
|   `-- validators/
|
|-- .env.example
|-- .sequelizerc
|-- package.json
`-- README.md
```

## Requisitos

- Node.js 18+
- MySQL 8+ ou compativel
- npm

## Como instalar

```bash
npm install
```

## Como configurar o `.env`

1. Copie o arquivo de exemplo:

```bash
Copy-Item .env.example .env
```

2. Ajuste os valores conforme seu ambiente MySQL.

Exemplo:

```env
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=petshop_db
DB_USER=root
DB_PASSWORD=senha_mysql
DB_LOGGING=false
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
JWT_SECRET=uma_chave_segura
JWT_EXPIRES_IN=1d
CEP_API_BASE_URL=https://viacep.com.br/ws
SWAGGER_SERVER_URL=http://localhost:3000
```

## Como criar o banco

Voce pode criar o banco de duas formas:

### Opcao 1: script Node

```bash
npm run db:create
```

### Opcao 2: SQL manual

Execute o arquivo `database/init.sql` no seu MySQL.

## Como rodar migrations

```bash
npm run db:migrate
```

## Como popular dados iniciais

```bash
npm run db:seed
```

Os seeders criam:

- 1 usuario administrador
- 3 tipos de servico basicos: `Banho`, `Tosa` e `Hotel`

Usuario admin inicial:

- email: `admin@petshop.local`
- senha: `admin123`

## Como iniciar o servidor

Ambiente de desenvolvimento:

```bash
npm run dev
```

Ambiente normal:

```bash
npm start
```

## Como acessar o Swagger

Com o servidor em execucao:

- Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)
- Health check: [http://localhost:3000/health](http://localhost:3000/health)

## Fluxo recomendado de uso

1. Crie o banco com `npm run db:create`
2. Rode as migrations com `npm run db:migrate`
3. Rode os seeders com `npm run db:seed`
4. Inicie a API com `npm run dev`
5. Faca login com o usuario admin
6. Use o token JWT nas rotas protegidas

## Autenticacao e autorizacao

### Login

`POST /api/auth/login`

Exemplo de body:

```json
{
  "email": "admin@petshop.local",
  "password": "admin123"
}
```

Resposta esperada:

```json
{
  "success": true,
  "message": "Login realizado com sucesso.",
  "data": {
    "user": {
      "id": 1,
      "name": "Administrador",
      "email": "admin@petshop.local",
      "role": "admin"
    },
    "token": "seu_jwt_aqui"
  }
}
```

### Uso do token

Envie o token no header:

```http
Authorization: Bearer SEU_TOKEN
```

### Regras de permissao

- rotas de autenticacao publica: `/api/auth/register` e `/api/auth/login`
- demais rotas exigem JWT
- gerenciamento de usuarios e escrita em tipos de servico exigem papel `admin`

## Endpoints principais

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Owners

- `GET /api/owners`
- `GET /api/owners/:id`
- `POST /api/owners`
- `PUT /api/owners/:id`
- `DELETE /api/owners/:id`

Filtros:

- `name`
- `document`
- `email`

### Pets

- `GET /api/pets`
- `GET /api/pets/:id`
- `POST /api/pets`
- `PUT /api/pets/:id`
- `DELETE /api/pets/:id`

Filtros:

- `name`
- `species`
- `ownerId`

### Service Types

- `GET /api/service-types`
- `GET /api/service-types/:id`
- `POST /api/service-types`
- `PUT /api/service-types/:id`
- `DELETE /api/service-types/:id`

Filtro:

- `name`

### Services

- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

Filtros:

- `petId`
- `serviceTypeId`
- `status`
- `fromDate`
- `toDate`

### Utilities

- `GET /api/utils/cep/:cep`

## Exemplos de uso

### Criar dono

```bash
curl -X POST http://localhost:3000/api/owners \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -d '{
    "name": "Carlos Lima",
    "document": "12345678900",
    "phone": "(11) 99999-0000",
    "email": "carlos@email.com",
    "address": "Rua das Flores, 100"
  }'
```

### Criar pet

```bash
curl -X POST http://localhost:3000/api/pets \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -d '{
    "name": "Thor",
    "species": "Cachorro",
    "breed": "Labrador",
    "size": "large",
    "age": 5,
    "weight": 28.4,
    "notes": "Alergia a perfume",
    "ownerId": 1
  }'
```

### Criar servico realizado

```bash
curl -X POST http://localhost:3000/api/services \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -d '{
    "petId": 1,
    "serviceTypeId": 1,
    "serviceDate": "2026-04-21T10:00:00.000Z",
    "chargedAmount": 55,
    "notes": "Atendimento concluido com sucesso",
    "status": "completed"
  }'
```

### Consultar CEP com Axios

```bash
curl http://localhost:3000/api/utils/cep/01001000 \\
  -H "Authorization: Bearer SEU_TOKEN"
```

## Respostas padronizadas

### Sucesso

```json
{
  "success": true,
  "message": "Operacao realizada com sucesso.",
  "data": {}
}
```

### Erro

```json
{
  "success": false,
  "message": "Dados de entrada invalidos.",
  "errors": [
    {
      "msg": "Email invalido.",
      "path": "email"
    }
  ]
}
```

## Scripts disponiveis

- `npm run dev`: inicia com nodemon
- `npm start`: inicia em modo normal
- `npm run db:create`: cria o banco se nao existir
- `npm run db:migrate`: executa migrations
- `npm run db:seed`: executa seeders
- `npm run db:reset`: desfaz migrations, recria estrutura e reaplica seeders

## Observacoes

- O projeto usa arquitetura em camadas para facilitar manutencao e evolucao.
- As listagens possuem filtros simples por query string.
- As consultas detalhadas incluem dados relacionados quando apropriado.
- O endpoint de CEP demonstra uso real de integracao HTTP com Axios.
