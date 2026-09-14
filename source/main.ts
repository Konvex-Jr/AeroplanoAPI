import { config } from "dotenv";
import PostgreSQLConnection from "./infra/database/PostgreSQLConnection";
import ExpressHttp from "./infra/http/ExpressHttp";
import Router from "./infra/http/Router";
import DatabaseRepositoryFactory from "./infra/repository/DatabaseRepositoryFactory";
import ExpressAuth from "./infra/http/Middleware/AuthExpress";
import CreateUsersTable from "./infra/migrations/01.create_users_table";
import CreatePostsTable from "./infra/migrations/02.create_posts_table";
import CreatePostContentsTable from "./infra/migrations/04.create_post_contents_table";
import BackfillUsernames from "./infra/migrations/06.backfill_usernames";

config();

console.log("🚀 Iniciando aplicação...");
console.log("📋 Variáveis de ambiente carregadas:");
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_USERNAME: process.env.DB_USERNAME ? "***" : "não definido",
  PORT: process.env.PORT || 5432,
});

async function runMigrations(connection: PostgreSQLConnection) {
  console.log("\n📦 Executando migrations...");

  const migrations = [
    { name: "users", instance: new CreateUsersTable(connection) },
    { name: "posts", instance: new CreatePostsTable(connection) },
    { name: "post_contents", instance: new CreatePostContentsTable(connection) },
    { name: "backfill_usernames", instance: new BackfillUsernames(connection) }
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

  console.log("✅ Todas as migrations foram executadas!\n");
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
  console.log("\n🛣️  === Rotas registradas ===");
  results.forEach(r => console.log(`  ${r}`));
  console.log("========================\n");
}

async function bootstrap() {
  try {
    console.log("1️⃣  Conectando ao banco de dados...");

    const connection = new PostgreSQLConnection({
      user: process.env.DB_USERNAME ?? "",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_DATABASE ?? "",
      host: process.env.DB_HOST ?? "",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    });

    console.log("✅ Conexão com banco de dados estabelecida!\n");

    console.log("2️⃣  Executando migrations...");
    await runMigrations(connection);

    console.log("3️⃣  Inicializando dependências...");
    const repositoryFactory = new DatabaseRepositoryFactory(connection);
    const auth = new ExpressAuth(repositoryFactory);
    const http = new ExpressHttp(auth);
    const router = new Router(http, repositoryFactory);

    console.log("✅ Dependências inicializadas!\n");

    console.log("4️⃣  Registrando rotas...");
    router.init();
    listRoutes(http);

    const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

    console.log(`5️⃣  Iniciando servidor na porta ${PORT}...`);
    await http.listen(PORT);

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log("✅ Bootstrap concluído com sucesso!");
    console.log("=".repeat(50) + "\n");

    console.log("🔐 Middleware de autenticação ativo");
    console.log("📝 Pronto para receber requisições!\n");

  } catch (err) {
    console.error("\n❌ Erro no bootstrap do servidor:");
    console.error(err);
    process.exit(1);
  }
}

bootstrap();