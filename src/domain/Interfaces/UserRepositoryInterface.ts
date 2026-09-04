import User from "../Entity/User.js";

export default interface UserRepositoryInterface {
    
    create(user: User): Promise<User | null>;
    update(user: User): Promise<User>;
    delete(user_id: string): Promise<void>;
    
    getAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithPassword(email: string): Promise<User | null>;
}
