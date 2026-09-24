import Connection from "../database/Connection";

export default class CreatePostsTable {
    constructor(private connection: Connection) {}

    // Idempotente: roda a cada boot, tanto em banco novo quanto em banco que
    // já foi criado pelo schema antigo (com PDF, file_size, username etc).
    async up(): Promise<void> {

        await this.connection.execute(`
            CREATE TABLE IF NOT EXISTS public.posts (
                id UUID PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                image TEXT NOT NULL DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            );
        `);

        // Banco antigo: garante a coluna da capa.
        await this.connection.execute(`
            ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';
        `);

        // A versão anterior tinha DEFAULT CURRENT_TIMESTAMP em deleted_at, o que
        // marcava como excluído qualquer post inserido sem informar essa coluna.
        await this.connection.execute(`
            ALTER TABLE public.posts ALTER COLUMN deleted_at DROP DEFAULT;
        `);

        // Colunas legadas (file_base64, file_size, original_filename, username...)
        // não são mais preenchidas. Se ainda forem NOT NULL, o INSERT quebraria;
        // então só relaxamos a restrição (nenhum dado é apagado).
        await this.connection.execute(`
            DO $$
            DECLARE col RECORD;
            BEGIN
                FOR col IN
                    SELECT column_name FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'posts'
                      AND is_nullable = 'NO'
                      AND column_name NOT IN ('id', 'title', 'description', 'image')
                LOOP
                    EXECUTE format('ALTER TABLE public.posts ALTER COLUMN %I DROP NOT NULL', col.column_name);
                END LOOP;
            END $$;
        `);
    }

    async down(): Promise<void> {
        await this.connection.execute(`DROP TABLE IF EXISTS public.posts;`);
    }
}
