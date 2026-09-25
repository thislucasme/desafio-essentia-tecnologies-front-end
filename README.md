# ✅ Desafio Essentia Tecnologies

Aplicação **Full Stack de gerenciamento de tarefas**, desenvolvida como desafio técnico utilizando Angular, NestJS e MySQL.

A aplicação possui autenticação de usuários, proteção de rotas, isolamento das tarefas por usuário, proteção contra requisições automatizadas com Cloudflare Turnstile e documentação interativa da API.

## 🔗 Links

- 🚀 **Demo:** https://desafio-essentia-tecnologies-front.vercel.app/
- 📚 **Swagger:** https://desafioessentiatecnologies.duckdns.org:4178/api/docs

---

## 🚀 Tecnologias

### Frontend

- Angular
- TypeScript
- Cloudflare Turnstile

### Backend

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT
- Swagger

### Infraestrutura

- Docker
- Nginx
- PM2
- HTTPS / Let's Encrypt
- DuckDNS
- Vercel

---

## ✨ Funcionalidades

- Cadastro de usuários
- Login com autenticação JWT
- Proteção contra bots com Cloudflare Turnstile
- Proteção de rotas autenticadas
- Isolamento de tarefas por usuário
- Criação de tarefas
- Edição de tarefas
- Exclusão de tarefas
- Alteração de status das tarefas
- Paginação
- Documentação interativa da API com Swagger
- API publicada com HTTPS

---

## 📦 Como executar localmente

### 1. Instale as dependências

Na raiz do projeto:

```bash
npm install
```

Depois instale as dependências do backend:

```bash
cd backend
npm install
```

---

### 2. Configure o backend

Dentro da pasta `backend`:

```bash
cp .env.example .env
```

Abra o arquivo `backend/.env` e configure as variáveis de ambiente:

```env
NODE_ENV=development
PORT=3008
FRONTEND_URL=http://localhost:4200

DB_HOST=localhost
DB_PORT=3309
DB_USERNAME=todo_user
DB_PASSWORD=todolist1234_
DB_DATABASE=todo_list
DB_SYNCHRONIZE=true

JWT_SECRET=coloque-uma-chave-segura
JWT_EXPIRES_IN=1d

TURNSTILE_SECRET_KEY=coloque-o-secret-do-turnstile
```

> [!IMPORTANT]
> O arquivo `.env` contém informações sensíveis e não deve ser enviado ao Git.

---

### 3. Inicie o banco de dados

Na pasta `backend`:

```bash
docker compose up -d mysql
```

---

### 4. Inicie o backend

Ainda na pasta `backend`:

```bash
npm run start:dev
```

O backend estará disponível em:

- **API:** http://localhost:3008/api
- **Swagger:** http://localhost:3008/api/docs

---

### 5. Inicie o frontend

Abra outro terminal na raiz do projeto:

```bash
npm start
```

A aplicação estará disponível em:

```text
http://localhost:4200
```

---

## ⚙️ Configuração do frontend

As configurações de ambiente do frontend estão localizadas em:

```text
src/environments/environment.development.ts
src/environments/environment.ts
```

Exemplo:

```ts
export const environment = {
  apiUrl: 'URL_DO_BACKEND/api',
  turnstileSiteKey: 'SITE_KEY_DO_TURNSTILE',
};
```

A `turnstileSiteKey` é pública e pode ser utilizada no frontend.

A `TURNSTILE_SECRET_KEY` é privada e deve permanecer exclusivamente no backend.

Para utilizar o Cloudflare Turnstile em ambiente local, adicione `localhost` aos hostnames permitidos na configuração do Turnstile.

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação dos usuários.

### Endpoints

| Método | Endpoint | Descrição | Acesso |
| --- | --- | --- | --- |
| `POST` | `/api/auth/cadastro` | Cria uma nova conta e retorna o token JWT | Público |
| `POST` | `/api/auth/login` | Autentica o usuário e retorna o token JWT | Público |
| `GET` | `/api/auth/perfil` | Retorna os dados do usuário autenticado | Protegido |

O cadastro e o login também utilizam **Cloudflare Turnstile** para proteção contra requisições automatizadas.

Nas rotas protegidas, o JWT deve ser enviado através do header:

```http
Authorization: Bearer SEU_TOKEN
```

---

## 📝 Tarefas

Todas as operações relacionadas às tarefas exigem autenticação.

Cada usuário possui acesso **exclusivamente às próprias tarefas**.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api/tarefas?page=1&limit=2` | Lista as tarefas com paginação |
| `GET` | `/api/tarefas/:id` | Consulta uma tarefa pelo ID |
| `POST` | `/api/tarefas` | Cria uma nova tarefa |
| `PATCH` | `/api/tarefas/:id` | Edita uma tarefa ou altera seu status |
| `DELETE` | `/api/tarefas/:id` | Exclui uma tarefa |

---

## 📚 Documentação da API

A API possui documentação interativa utilizando **Swagger**.

### Swagger em produção

https://desafioessentiatecnologies.duckdns.org:4178/api/docs

Através do Swagger é possível visualizar e testar os endpoints, parâmetros, DTOs e respostas disponibilizados pela API.

---

## 🌐 Deploy

### Frontend

O frontend está publicado na **Vercel**:

https://desafio-essentia-tecnologies-front.vercel.app/

### Backend

O backend está publicado em uma VPS.

A infraestrutura segue o seguinte fluxo:

```text
Internet
   │
   ▼
DuckDNS
   │
   ▼
HTTPS / Let's Encrypt
   │
   ▼
Nginx :4178
   │
   ▼
NestJS
   │
   ▼
TypeORM
   │
   ▼
MySQL
```

### Infraestrutura do backend

**DuckDNS**

Responsável pela resolução do domínio utilizado pela API.

**Let's Encrypt**

Responsável pelo certificado SSL utilizado para disponibilizar a API através de HTTPS.

**Nginx**

Utilizado como reverse proxy e responsável pela terminação HTTPS antes de encaminhar as requisições para a aplicação NestJS.

**PM2**

Responsável pelo gerenciamento do processo Node.js em produção.

**Docker**

Utilizado para execução do banco de dados MySQL.

---

## 🔒 HTTPS

A API publicada está disponível através de HTTPS:

```text
https://desafioessentiatecnologies.duckdns.org:4178
```

O certificado SSL foi emitido através do **Certbot + Let's Encrypt**, utilizando validação DNS.

> [!NOTE]
> O certificado atual foi emitido utilizando validação DNS manual. Portanto, a renovação automática precisa ser configurada separadamente.

---

## 🛡️ Segurança

A aplicação utiliza diferentes mecanismos para proteção da API e dos dados dos usuários:

- Autenticação utilizando JWT
- Proteção de endpoints através de Guards
- Isolamento das tarefas por usuário
- Validação dos dados recebidos pela API
- Cloudflare Turnstile contra requisições automatizadas
- HTTPS em produção
- Variáveis de ambiente para informações sensíveis

---


### Backend

Entre na pasta do backend:

```bash
cd backend
```

Execute os testes:

```bash
npm test
```

Para gerar o build:

```bash
npm run build
```

---

## 🏗️ Arquitetura

De forma simplificada, a aplicação segue a seguinte arquitetura:

```text
┌─────────────────────────────┐
│          Angular            │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ HTTP / JWT
               ▼
┌─────────────────────────────┐
│           NestJS            │
│             API             │
│                             │
│  • Controllers              │
│  • Services                 │
│  • Guards                   │
│  • DTOs                     │
│  • JWT                      │
│  • Turnstile                │
└──────────────┬──────────────┘
               │
               │ TypeORM
               ▼
┌─────────────────────────────┐
│            MySQL            │
└─────────────────────────────┘
```

---

## 🔄 Fluxo de autenticação

```text
Usuário
   │
   ▼
Angular
   │
   ├── Cloudflare Turnstile
   │
   ▼
POST /api/auth/login
   │
   ▼
NestJS
   │
   ├── Valida Turnstile
   ├── Valida credenciais
   └── Gera JWT
           │
           ▼
        Frontend
           │
           │ Authorization: Bearer <token>
           ▼
     Rotas protegidas
```

---

## 📁 Estrutura geral

```text
Frontend
├── Angular
├── TypeScript
└── Cloudflare Turnstile

Backend
├── NestJS
├── TypeScript
├── TypeORM
├── JWT
└── Swagger

Banco de dados
└── MySQL

Infraestrutura
├── Docker
├── PM2
├── Nginx
├── DuckDNS
└── Let's Encrypt

Deploy
├── Frontend → Vercel
└── Backend  → VPS
```

---

## 🔗 Links do projeto

### 🚀 Aplicação

https://desafio-essentia-tecnologies-front.vercel.app/

### 📚 Swagger

https://desafioessentiatecnologies.duckdns.org:4178/api/docs
