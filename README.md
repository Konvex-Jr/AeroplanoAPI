
# Professor Marcos Backend

Backend em TypeScript para o blog do Professor Marcos, seguindo Clean Architecture. O projeto separa domínio, casos de uso, infraestrutura e testes, promovendo manutenibilidade e escalabilidade.

---

## Arquitetura e Princípios Utilizados

- **Clean Architecture**: Separação clara entre domínio, casos de uso, infraestrutura e interfaces.
- **Domain-Driven Design**: Entidades e regras de negócio isoladas em `domain/`.
- **Injeção de Dependências**: Repositórios e serviços são injetados via fábricas.
- **Testes Automatizados**: Casos de uso testados isoladamente com repositórios em memória.
- **Autenticação JWT (RS256)**: Proteção de rotas privadas via middleware.

### Estrutura de Pastas

```
├── docker-compose.yml         # Banco de dados PostgreSQL
├── gerarKeys.js               # Geração de chaves RSA para JWT
├── package.json / tsconfig.json
├── source/
│   ├── main.ts                # Ponto de entrada
│   ├── domain/                # Entidades e interfaces
│   ├── infra/                 # Controladores, banco, HTTP, repositórios, migrations
│   └── useCases/              # Casos de uso (ex: criar usuário, criar post)
├── test/                      # Testes automatizados
```

---

## Rotas e Recursos Disponíveis

### Usuários

- `POST /api/auth/register` — Cria um novo usuário (público)
  - Body: `{ name, email, password }`
  - Retorna: `{ accessToken }`

- `POST /api/auth/login` — Login de usuário (público)
  - Body: `{ email, password }`
  - Retorna: `{ accessToken }`

- `GET /api/users` — Lista todos os usuários (privado, requer JWT)
  - Header: `access-token: <jwt>`

- `POST /api/users/:id` — Busca usuário por ID (privado, requer JWT)
  - Body: `{ userId }`

### Posts

- `POST /api/posts` — Cria um novo post (privado, requer JWT)
  - Body: `{ description, post_string }`

- `GET /api/posts` — Lista todos os posts (público)
  - Query opcional: `search=<data>` para buscar por data

- `GET /api/posts/:id` — Busca post por ID (privado, requer JWT)

- `PATCH /api/posts/:id` — Atualiza um post (privado, requer JWT)
  - Body: `{ description, post_string }`

- `DELETE /api/posts/:id` — Remove um post (privado, requer JWT)

---

## Detalhe dos Testes Automatizados

Os testes cobrem todos os casos de uso principais, utilizando repositórios em memória para garantir isolamento e rapidez. Exemplos:

- **Usuários**
  - Criação de usuário (valida senha, email, token)
  - Login (valida senha, gera token, falha para usuário inexistente)
  - Busca por ID e listagem
- **Posts**
  - Criação, busca por ID, busca por data, listagem, atualização e remoção
  - Validações de campos obrigatórios e formatos de ID

Os testes estão em `test/` e podem ser executados via `npm run test`.

---

## Como Executar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Gere as chaves RSA para JWT:
   ```bash
   npm run generate-keys
   ```
3. Configure o arquivo `.env` com as variáveis do banco:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=db_professor_marcos
   DB_USERNAME=admin
   DB_PASSWORD=admin
   PORT=3000
   ```
4. Suba o banco de dados:
   ```bash
   docker compose up -d
   ```
5. Rode os testes:
   ```bash
   npm run test
   ```
6. Compile e inicie a aplicação:
   ```bash
   npm run main
   ```

---

## Como Expandir

- Adicione novas entidades em `domain/Entity/`
- Crie novos casos de uso em `useCases/`
- Implemente controladores e rotas para novos recursos
- Crie migrations para novas tabelas

---

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorias!

---

## Licença

MIT

## Exemplos de Endpoints

- `POST /users` — Cria um novo usuário
- `POST /posts` — Cria um novo post
- `GET /posts` — Lista todos os posts
- `GET /posts/:id` — Busca um post por ID
- `PUT /posts/:id` — Atualiza um post

---

## Como Executar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` com as variáveis do banco.

    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=db_professor_marcos
    DB_USERNAME=admin
    DB_PASSWORD=admin

3. Suba o banco de dados:
   ```bash
   docker compose up -d
   ```

4. Verifique se o contêiner está rodando:
    ```bash
   docker ps
   ```

5. Rode os Testes:
    ```bash
   npm run test
   ```

6. Suba a aplicação:
    ```bash
   npm run main
   ```

## Como Expandir

- Adicione novas entidades em `domain/Entity/`
- Crie novos casos de uso em `useCases/`
- Implemente controladores e rotas para novos recursos
- Crie migrations para novas tabelas

---

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorias!

---

## Licença

MIT
