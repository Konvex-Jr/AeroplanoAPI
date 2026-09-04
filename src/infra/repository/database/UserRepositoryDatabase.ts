import User from "../../../domain/Entity/User.js";
import UserRepositoryInterface from "../../../domain/Interfaces/UserRepositoryInterface.js";
import Connection from "../../database/Connection.js";

export default class UserRepositoryDatabase implements UserRepositoryInterface {

    constructor(protected connection: Connection) { }

    async create(user: User): Promise<User | null> {
        await this.connection.execute("INSERT INTO users (id, email, password) VALUES ($1, $2, $3);", [ user.id, user.email, user.password ]);
        return await this.findById(user.id);
    }

    // [ ] Implement Deletion
    async delete(user_id: string): Promise<void> {
        await this.connection.execute("DELETE FROM users WHERE $id = $1;", [ user_id ])
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.connection.execute("SELECT id, email FROM users WHERE id = $1;", [ id ]);
        return result?.[0] ? new User(result[0].id, result[0].email, '********') : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.connection.execute("SELECT id, email FROM users WHERE email = $1;", [ email ]);
        return result?.[0] ? new User(result[0].id, result[0].email, '********') : null;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        const result = await this.connection.execute("SELECT id, email, password FROM users WHERE email = $1;", [ email ]);
        return result?.[0] ? new User(result[0].id, result[0].email, result[0].password) : null;
    }

    async getAll(): Promise<User[]> {
        const result = await this.connection.execute("SELECT id, email FROM users;");
        return result.map((user: any) => new User(user.id, user.email, '********'));
    }

    async update(user: User): Promise<User> {
        await this.connection.execute("UPDATE users SET email = $1, password = $2 WHERE id = $3;", [ user.email, user.password, user.id ]);
        return user;
    }

    async updateUsername(id: string, username: string): Promise<void> {
        await this.connection.execute("UPDATE users SET username = $1 WHERE id = $2;", [ username, id ]);
    }
}