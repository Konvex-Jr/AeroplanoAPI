import { UserRole } from "../../domain/Entity/User";

export default interface CreateUserInput {
    id?: string;
    email: string;
    password: string;
    role?: UserRole;
    username?: string;
}