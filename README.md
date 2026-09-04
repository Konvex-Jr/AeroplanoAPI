# Aeroplano API

## Requisitos

- Criar um Usuário
- Logar com um Usuário

- Criar um Post
- Atualizar um Post
- Excluir um Post

- Visualizar todos os Posts

## Execução

Clone o projeto

```bash
git clone https://github.com/Konvex-Jr/AeroplanoAPI.git
```

Autentique-se com o seu usuário

Acesse o projeto

```bash
cd AeroplanoAPI/
```

Crie as suas variáveis de ambiente em um arquivo *.env*

```bash
    DB_HOST="localhost"
    DB_USERNAME="your_db_username"
    DB_PASSWORD="your_strong_password_here"
    DB_DATABASE="your_db_name"

    DB_PORT=5432

    PORT=3333

    JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n<your_private_key_content>\n-----END RSA PRIVATE KEY-----\n"

    JWT_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----\n<your_public_key_content>\n-----END RSA PUBLIC KEY-----\n"

    CORS_ORIGIN="http://localhost:3333"
```

Também crie um arquivo *docker-compose.yml* com a seguinte estrutura, e com as suas próprias variáveis:

```bash
    services:
        db:
            image: postgres:15-alpine
            container_name: conteiner_name
            environment:
            POSTGRES_HOST: your_host
            POSTGRES_USER: your_user
            POSTGRES_PASSWORD: your_password
            POSTGRES_DB: your_db_name
            volumes:
                - postgres_data:/var/lib/postgresql/data
            ports:
                - "5432:5432"
    volumes:
        postgres_data:
```

Instale as dependências com

```bash
npm install
```

Rode o servidor de desenvolvimento com

```bash
npm run server
```