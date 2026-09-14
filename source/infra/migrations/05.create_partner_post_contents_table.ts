import Connection from "../database/Connection";

export default class CreatePartnerPostContentsTable {
    constructor(private connection: Connection) {}

    async up(): Promise<void> {
        await this.connection.execute(`
            ALTER TABLE public.partner_posts
                ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '',
                ADD COLUMN IF NOT EXISTS file_size INTEGER NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255) NOT NULL DEFAULT '';
        `);

        await this.connection.execute(`
            ALTER TABLE public.partner_posts
                DROP COLUMN IF EXISTS file_base64;
        `);

        await this.connection.execute(`
            CREATE TABLE IF NOT EXISTS public.partner_post_contents (
                post_id UUID PRIMARY KEY REFERENCES public.partner_posts(id) ON DELETE CASCADE,
                content BYTEA NOT NULL
            );
        `);
    }

    async down(): Promise<void> {
        await this.connection.execute(`DROP TABLE IF EXISTS public.partner_post_contents;`);
    }
}
