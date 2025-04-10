# 🥗 Daily Diet API

**Daily Diet API** é uma aplicação backend desenvolvida para gerenciar refeições e acompanhar métricas relacionadas à dieta. Este projeto foi criado como parte do primeiro módulo de **Node.js** do meu curso na Rocketseat, utilizando tecnologias modernas e boas práticas de desenvolvimento.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** com **Fastify**: Framework rápido e eficiente para criar APIs RESTful.
- **TypeScript**: Para garantir segurança e tipagem no desenvolvimento.
- **SQLite** com **Knex.js**: Banco de dados leve e simples, gerenciado com um query builder poderoso.
- **Zod**: Para validação de dados de entrada de forma robusta.
- **Swagger**: Documentação automática das rotas, acessível via interface gráfica.
- **@fastify/cookie**: Para gerenciar cookies e sessões de usuários.

---

## 📋 Funcionalidades

- **Usuários**:
  - Criar um novo usuário.
  - Identificar o usuário entre as requisições utilizando cookies.

- **Refeições**:
  - Registrar uma refeição com:
    - Nome
    - Descrição
    - Data e Hora
    - Informação se está dentro ou fora da dieta.
  - Editar uma refeição.
  - Apagar uma refeição.
  - Listar todas as refeições de um usuário.
  - Visualizar os detalhes de uma refeição específica.

- **Métricas**:
  - Quantidade total de refeições registradas.
  - Quantidade total de refeições dentro da dieta.
  - Quantidade total de refeições fora da dieta.
  - Melhor sequência de refeições dentro da dieta.

---

## 📂 Estrutura do Projeto

daily-diet-api/
    ├── src/
    │   ├── @types/          # Tipos personalizados para o Fastify
    │   ├── db/             # Configuração do banco de dados e migrations
    │   ├── middlewares/    # Middlewares para validação
    │   ├── routes/         # Rotas da aplicação (users e diets)
    │   ├── app.ts          # Configuração principal do Fastify
    │   └── server.ts       # Inicialização do servidor
    ├── knexfile.ts         # Configuração do Knex.js
    ├── package.json        # Dependências e scripts
    ├── tsconfig.json       # Configuração do TypeScript
    └── README.md           # Documentação do projeto

    ---

## 🌐 Documentação da API

A API está documentada com **Swagger** e pode ser acessada em:

http://localhost:8080/docs

### Exemplos de Rotas:

- **Criar Usuário**: `POST /user/create`
- **Registrar Refeição**: `POST /diet/create-meal`
- **Listar Refeições**: `GET /diet/all`
- **Resumo das Refeições**: `GET /diet/summary`

---

## 📝 Regras da Aplicação

- [x] Deve ser possível criar um usuário.
- [x] Deve ser possível identificar o usuário entre as requisições.
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta.
  - *As refeições devem ser relacionadas a um usuário.*
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima.
- [x] Deve ser possível apagar uma refeição.
- [x] Deve ser possível listar todas as refeições de um usuário.
- [x] Deve ser possível visualizar uma única refeição.
- [x] Deve ser possível recuperar as métricas de um usuário:
  - Quantidade total de refeições registradas.
  - Quantidade total de refeições dentro da dieta.
  - Quantidade total de refeições fora da dieta.
  - Melhor sequência de refeições dentro da dieta.
- [x] O usuário só pode visualizar, editar e apagar as refeições que ele criou.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos:
- Node.js instalado (versão 18 ou superior).
- Gerenciador de pacotes `npm` ou `yarn`.

### Passos:
1. Clone o repositório:
   ```bash
   git clone https://github.com/borsatogiordano/daily-diet-node.git
   cd daily-diet-node


## 💡 Aprendizados
Este projeto foi uma experiência incrível para consolidar conhecimentos em:

- Criação de APIs RESTful com Fastify.
- Validação de dados com Zod.
- Organização de projetos backend com TypeScript.
- Documentação de APIs com Swagger.