import User, { UserRole } from "../../../domain/Entity/User";
import UserRepositoryInterface from "../../../domain/Interfaces/UserRepositoryInterface";

export default class UserRepositoryMemory implements UserRepositoryInterface {

    private users: User[];

    constructor() {
        this.users = [];
    }
    
    async create(user: User): Promise<User> { 
        this.users.push(user);
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.id === id);
        return user ?? null;
    }
    
    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(user => user.email === email);
        return user ?? null;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        return this.findByEmail(email);
    }

    async getAll(): Promise<User[]> {
        return this.users;
    }

    async update(user: User): Promise<User> {
        const index = this.users.findIndex(existingUser => existingUser.id === user.id);
        this.users[index] = user;
        return user;
    }
}