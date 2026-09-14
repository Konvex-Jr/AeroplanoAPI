import Connection from "../database/Connection";

export default class BackfillUsernames {
    constructor(private connection: Connection) {}

    async up(): Promise<void> {
        // Set username to the part before @ in email for any user with an empty username
        await this.connection.execute(`
            UPDATE public.users
            SET username = SPLIT_PART(email, '@', 1)
            WHERE username = '' OR username IS NULL;
        `);
    }

    async down(): Promise<void> {}
}
