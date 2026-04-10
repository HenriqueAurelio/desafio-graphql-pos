# FinTrack — Sistema de Gestão Financeira Pessoal

Projeto de conclusão de pós-graduação em Desenvolvimento Full Stack. Aplicação web para controle financeiro pessoal, permitindo ao usuário registrar receitas e despesas, organizar por categorias e visualizar onde está concentrando mais seus gastos.

---

## Objetivo

Desenvolver uma aplicação full stack moderna que permita ao usuário:

- Cadastrar e gerenciar **transações financeiras** (receitas e despesas)
- Organizar transações por **categorias personalizadas** (com ícone e cor)
- Analisar o **perfil de gastos** por categoria e período
- Ter uma visão clara do **saldo**, total de entradas e saídas

O projeto aplica na prática os conceitos estudados na pós-graduação: arquitetura de APIs com GraphQL, autenticação stateless com JWT, ORM com Prisma e construção de interfaces reativas com React.

---

## Funcionalidades

### Usuários
- Cadastro com nome, e-mail e senha (senha armazenada com hash bcrypt)
- Autenticação via JWT com cookie httpOnly
- Perfil do usuário autenticado

### Categorias
- Criar, listar, editar e excluir categorias
- Cada categoria possui título, descrição, ícone e cor
- Categorias são privadas por usuário

### Transações
- Criar, listar, editar e excluir transações
- Tipos: **Receita (INCOME)** e **Despesa (EXPENSE)**
- Vinculação obrigatória a uma categoria
- Filtros por tipo, categoria e período
- Análise de gastos: total por categoria, saldo geral

---

## Tecnologias

### Backend
| Tecnologia | Finalidade |
|---|---|
| Node.js + TypeScript | Runtime e tipagem estática |
| Express 5 | Servidor HTTP |
| Apollo Server + GraphQL | Camada de API |
| TypeGraphQL | Definição de schema via decorators TypeScript |
| Prisma ORM | Acesso ao banco de dados com type-safety |
| SQLite | Banco de dados (via better-sqlite3) |
| JWT + bcryptjs | Autenticação e hash de senhas |
| Biome | Linting e formatação |

### Frontend
| Tecnologia | Finalidade |
|---|---|
| React 18 | Biblioteca de UI |
| Vite | Bundler e dev server |
| TypeScript | Tipagem estática |
| Apollo Client | Comunicação com a API GraphQL |

---

## Arquitetura

```
desafio-graphql-pos/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos: User, Category, Transaction
│   │   ├── migrations/          # Histórico de migrações do banco
│   │   └── seed.ts              # Dados iniciais para desenvolvimento
│   ├── src/
│   │   ├── resolvers/           # Resolvers GraphQL (queries e mutations)
│   │   ├── models/              # Classes de modelo (TypeGraphQL)
│   │   ├── dtos/                # Tipos de entrada e saída da API
│   │   ├── middleware/          # Autenticação JWT
│   │   ├── graphql/             # Contexto e decorators
│   │   ├── utils/               # Hash e JWT helpers
│   │   └── index.ts             # Entrypoint do servidor
│   └── schema.graphql           # Schema gerado automaticamente
└── frontend/
    └── src/
        ├── pages/               # Telas da aplicação
        ├── components/          # Componentes reutilizáveis
        └── graphql/             # Queries e mutations Apollo
```

---

## Modelo de Dados

```
User
 ├── id, name, email, password
 ├── categories[]  →  Category
 └── transactions[] → Transaction

Category
 ├── id, title, description, icon, color
 └── transactions[] → Transaction

Transaction
 ├── id, name, amount, type (INCOME | EXPENSE), date
 ├── → Category
 └── → User
```

---

## Como executar

### Pré-requisitos
- Node.js 18+
- npm

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migrate      # aplica as migrações no banco SQLite
npm run seed         # popula com dados de exemplo (opcional)
npm run dev          # inicia em modo desenvolvimento
```

A API GraphQL estará disponível em `http://localhost:4000/graphql`.

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor | `4000` |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT | — |
| `DATABASE_URL` | Caminho do banco SQLite | `file:./dev.db` |

---

## Contexto Acadêmico

Projeto desenvolvido como trabalho de conclusão de pós-graduação em Desenvolvimento Full Stack. Aplica conceitos de:

- Design de APIs com **GraphQL** (schema-first vs code-first com TypeGraphQL)
- Autenticação e autorização com **JWT**
- Modelagem relacional com **Prisma ORM**
- Componentização e gerenciamento de estado no **React**
- Integração frontend/backend via **Apollo Client**
