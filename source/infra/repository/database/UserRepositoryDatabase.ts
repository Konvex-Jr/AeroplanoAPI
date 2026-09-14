import User, { UserRole } from "../../../domain/Entity/User";
import UserRepositoryInterface from "../../../domain/Interfaces/UserRepositoryInterface";
import Connection from "../../database/Connection";

export default class UserRepositoryDatabase implements UserRepositoryInterface {

    constructor(protected connection: Connection) {
    }

    async create(user: User): Promise<User | null> {
        await this.connection.execute("INSERT INTO users (id, email, password, role, username, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7);", [user.id, user.email, user.password, user.role, user.username, new Date(), new Date()]);
        return await this.findById(user.id);
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.connection.execute("SELECT id, email, role, username FROM users WHERE id = $1;", [id]);
        return result?.[0] ? new User(result[0].email, '', result[0].id, result[0].role as UserRole, result[0].username) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.connection.execute("SELECT id, email, role, username FROM users WHERE email = $1;", [email]);
        return result?.[0] ? new User(result[0].email, '', result[0].id, result[0].role as UserRole, result[0].username) : null;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        const result = await this.connection.execute("SELECT id, email, password, role, username FROM users WHERE email = $1;", [email]);
        return result?.[0] ? new User(result[0].email, result[0].password, result[0].id, result[0].role as UserRole, result[0].username) : null;
    }

    async getAll(): Promise<User[]> {
        const result = await this.connection.execute("SELECT id, email, role, username FROM users;");
        return result.map((user: any) => new User(user.email, '', user.id, user.role as UserRole, user.username));
    }

    async update(user: User): Promise<User> {
        await this.connection.execute("UPDATE users SET email = $1, password = $2 WHERE id = $3;", [user.email, user.password, user.id]);
        return user;
    }

    async updateUsername(id: string, username: string): Promise<void> {
        await this.connection.execute("UPDATE users SET username = $1 WHERE id = $2;", [username, id]);
    }
}