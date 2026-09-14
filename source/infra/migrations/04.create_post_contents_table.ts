import Connection from "../database/Connection";

export default class CreatePostContentsTable {
    constructor(private connection: Connection) {}

    async up(): Promise<void> {
        await this.connection.execute(`
            ALTER TABLE public.posts
                ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '',
                ADD COLUMN IF NOT EXISTS file_size INTEGER NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255) NOT NULL DEFAULT '',
                ADD COLUMN IF NOT EXISTS username VARCHAR(100) NOT NULL DEFAULT '';
        `);

        await this.connection.execute(`
            ALTER TABLE public.posts
                DROP COLUMN IF EXISTS file_base64;
        `);

        await this.connection.execute(`
            CREATE TABLE IF NOT EXISTS public.post_contents (
                post_id UUID PRIMARY KEY REFERENCES public.posts(id) ON DELETE CASCADE,
                content BYTEA NOT NULL
            );
        `);
    }

    async down(): Promise<void> {
        await this.connection.execute(`DROP TABLE IF EXISTS public.post_contents;`);
    }
}
