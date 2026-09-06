import Connection from "../database/Connection.js";

export default class CreateUsersTable {
    constructor(private connection: Connection) {}

    async up(): Promise<void> {
        await this.connection.execute(`
            CREATE TABLE IF NOT EXISTS users ( 
                id        UUID PRIMARY KEY, 
                email     TEXT NOT NULL UNIQUE, 
                password  TEXT NOT NULL
            );`);
    }

    async down(): Promise<void> {
        await this.connection.execute(`DROP TABLE IF EXISTS users;`);
    }
}
