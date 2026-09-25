# Desafio Técnico — Essentia Technologies

## Aplicação de Gerenciamento de Tarefas
O projeto consiste em um sistema de gerenciamento de tarefas com autenticação de usuários, permitindo que cada usuário cadastre, visualize, edite e exclua suas próprias tarefas.

## Tecnologias utilizadas

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
- Vercel
- VPS
- HTTPS / Let's Encrypt

## Funcionalidades implementadas

- Cadastro de usuários
- Login e autenticação com JWT
- Proteção de rotas autenticadas
- Isolamento das tarefas por usuário
- Criação de tarefas
- Edição de tarefas
- Exclusão de tarefas
- Alteração do status das tarefas
- Paginação
- Validação dos dados da API
- Proteção contra requisições automatizadas com Cloudflare Turnstile
- Documentação da API com Swagger

## Aplicação publicada

O frontend e o backend foram disponibilizados publicamente para facilitar a avaliação do projeto.

**Aplicação**

https://desafio-essentia-tecnologies-front.vercel.app/

**Documentação da API**

https://desafioessentiatecnologies.duckdns.org:4178/api/docs

## Arquitetura

O frontend desenvolvido em Angular se comunica com uma API REST desenvolvida em NestJS.

A autenticação é realizada através de JWT e as rotas protegidas permitem acesso somente aos dados pertencentes ao usuário autenticado.

A persistência dos dados utiliza MySQL através do TypeORM.

Em produção, o frontend está hospedado na Vercel e o backend em uma VPS, utilizando Nginx como reverse proxy, PM2 para gerenciamento do processo Node.js e HTTPS com certificado Let's Encrypt.

## Código-fonte

https://github.com/thislucasme/desafio-essentia-tecnologies-front-end
