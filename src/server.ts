import PostgreSQLConnection from "./infra/database/PostgreSQLConnection.js";
import ExpressHttp from "./infra/http/ExpressHttp.js";
import Router from "./infra/http/Router.js";
import DatabaseRepositoryFactory from "./infra/repository/DatabaseRepositoryFactory.js";
import ExpressAuth from "./infra/http/middlewares/AuthExpress.js";
import CreateUsersTable from "./infra/migrations/01.create_users_table.js";
import CreatePostsTable from "./infra/migrations/02.create_posts_table.js";
import { env } from "./env/index.js";


console.log("🚀 Iniciando Aplicação...");
console.log("📋 Variáveis de Ambiente Carregadas:");
console.log({
  DB_HOST: env.DB_HOST,
  DB_PORT: env.DB_PORT,
  DB_DATABASE: env.DB_DATABASE,
  DB_USERNAME: env.DB_USERNAME ? "********" : "não definido",
  PORT: env.PORT || 5432,
});

async function runMigrations(connection: PostgreSQLConnection) {
  console.log("\n📦 Executando Migrations...");
  
  const migrations = [
    { name: "USERS", instance: new CreateUsersTable(connection) },
    { name: "POSTS", instance: new CreatePostsTable(connection) }
  ];

  for (const migration of migrations) {
    try {
      console.log(`  ⏳ Executando migration '${migration.name}'...`);
      await migration.instance.up();
      console.log(`  ✅ Migration '${migration.name}' executada com sucesso!`);
    } catch (err) {
      console.error(`  ❌ Erro ao executar a migration '${migration.name}':`, err);
      throw err;
    }
  }
  
  console.log("✅ Todas as migrations foram executadas com sucesso!\n");
}

function listRoutes(http: ExpressHttp) {
  
  const stack = http["app"]._router.stack;
  const results: string[] = [];

  function traverse(stack: any[], prefix = "") {
    stack.forEach((layer: any) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods)
          .map(m => m.toUpperCase())
          .join(", ");
        results.push(`${methods} ${prefix}${layer.route.path}`);
      } else if (layer.name === "router" && layer.handle.stack) {
        const newPrefix = layer.regexp?.source
          ?.replace("^\\", "")
          ?.replace("\\/?(?=\\/|$)", "")
          ?.replace(/\\\//g, "/") || "";
        traverse(layer.handle.stack, prefix + newPrefix);
      }
    });
  }

  traverse(stack);
  console.log("\n🛣️  === Rotas Registradas ===");
  results.forEach(r => console.log(`  ${r}`));
  console.log("========================\n");
}

async function bootstrap() {
  try {
    console.log("1️⃣  Conectando ao Banco de Dados...");
    
    const connection = new PostgreSQLConnection({
      db_user: env.DB_USERNAME ?? "",
      db_password: env.DB_PASSWORD ?? "",
      db_database: env.DB_DATABASE ?? "",
      db_host: env.DB_HOST ?? "",
      db_port: env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    });

    console.log("✅ Conexão com Banco de Dados estabelecida!\n");

    console.log("2️⃣  Executando Migrations...");
    await runMigrations(connection);

    console.log("3️⃣  Inicializando Dependências...");
    const repositoryFactory = new DatabaseRepositoryFactory(connection);
    const auth = new ExpressAuth(repositoryFactory);
    const http = new ExpressHttp(auth);
    const router = new Router(http, repositoryFactory);

    console.log("✅ Dependências Inicializadas!\n");

    console.log("4️⃣  Registrando Rotas...");
    router.init();
    listRoutes(http);

    const PORT = env.PORT ? Number(env.PORT) : 8000;
    
    console.log(`5️⃣  Iniciando Servidor na Porta: ${PORT}...`);
    await http.listen(PORT);
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ Bootstrap Concluído com Sucesso!");
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log("=".repeat(50) + "\n");
    
    console.log("🔐 Middleware de Autenticação Ativo");
    console.log("📝 Pronto para receber Requisições!\n");

  } catch (err) {
    console.error("\n❌ Erro no Bootstrap do Servidor:");
    console.error(err);
    process.exit(1);
  }
}

bootstrap();