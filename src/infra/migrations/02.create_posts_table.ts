import Connection from "../database/Connection.js";

export default class CreatePostsTable {
    constructor(private connection: Connection) {}

    async up(): Promise<void> {
        await this.connection.execute(`
            CREATE TABLE IF NOT EXISTS posts (
                id          UUID PRIMARY KEY, 
                title       TEXT NOT NULL, 
                image       BYTEA NOT NULL, 
                content     TEXT NOT NULL, 
                file_size   INT NOT NULL, 
                file_type   TEXT NOT NULL, 
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                user_id     UUID REFERENCES users(id)
            );`);
    }

    async down(): Promise<void> {
        await this.connection.execute(`DROP TABLE IF EXISTS posts;`);
    }
}
