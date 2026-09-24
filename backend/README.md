# API Minha Lista

Backend NestJS da aplicação de tarefas, com MySQL, TypeORM, autenticação JWT, validação de DTOs, tratamento global de erros e Swagger.

## Requisitos

- Node.js 20 ou superior
- MySQL 8 ou Docker

## Configuração

```bash
cp .env.example .env
npm install
```

Para iniciar somente o MySQL com Docker:

```bash
docker compose up -d mysql
```

Para iniciar a API em desenvolvimento:

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000/api` e a documentação Swagger em `http://localhost:3000/api/docs`.

## Autenticação

Depois de fazer cadastro ou login, envie o token retornado nas rotas protegidas:

```text
Authorization: Bearer SEU_TOKEN
```

## Rotas

### Autenticação

- `POST /api/auth/cadastro`
- `POST /api/auth/login`
- `GET /api/auth/perfil`

### Tarefas

- `GET /api/tarefas?page=1&limit=2`
- `GET /api/tarefas/:id`
- `POST /api/tarefas`
- `PATCH /api/tarefas/:id`
- `DELETE /api/tarefas/:id`

Cada tarefa pertence ao usuário autenticado. Consultas, edições e exclusões sempre consideram o ID do usuário presente no JWT.

## Observação sobre o banco

`DB_SYNCHRONIZE=true` é conveniente durante o aprendizado porque o TypeORM cria as tabelas automaticamente. Em produção, utilize migrações e configure `DB_SYNCHRONIZE=false`.
