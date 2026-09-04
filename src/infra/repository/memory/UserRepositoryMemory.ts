import User from "../../../domain/Entity/User.js";
import UserRepositoryInterface from "../../../domain/Interfaces/UserRepositoryInterface.js";

export default class UserRepositoryMemory implements UserRepositoryInterface {

    private users: User[];

    constructor() {
        this.users = [];
    }
    
    async create(user: User): Promise<User> { 
        this.users.push(user);
        return user;
    }

    async update(user: User): Promise<User> {
        const index = this.users.findIndex(existingUser => existingUser.id === user.id);
        this.users[index] = user;
        return user;
    }

    async delete(user_id: string): Promise<void> {
        this.users = this.users.filter((user: User) => { user.id !== user_id });
    }

    async getAll(): Promise<User[]> {
        return this.users;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.id === id);
        return user ? new User(user.id, user.email, '********') : null;
    }
    
    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(user => user.email === email);
        return user ? new User(user.id, user.email, '********') : null;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        const user = this.users.find(user => user.email === email);
        return user ? new User(user.id, user.email, user.password) : null;
    }
}