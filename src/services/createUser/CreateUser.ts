import AppError from "../../domain/AppError.js";
import { hash } from "bcrypt";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface.js";
import User from "../../domain/Entity/User.js";
import jwt from "jsonwebtoken";
import { env } from "@/env/index.js";

const { sign } = jwt

export interface CreateUserInput {
    email: string;
    password: string;
}

export interface CreateUserOutput {
    access_token: string;
    user_id: string;
    user_email: string;
}

export default class CreateUser {

    readonly userRepository: UserRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: CreateUserInput): Promise<CreateUserOutput> {
        
        const { email, password } = input

        if (password.length < 8) throw new AppError("Password must contain at least 8 characters.");

        const existing = await this.userRepository.findByEmail(email);

        if (existing) throw new AppError("Unable to create account. Check details and try again.");

        const encrypt_password = await hash(password, 12);

        const user = new User(email, encrypt_password);

        await this.userRepository.create(user);

        const privateKey = (env.JWT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

        const payload = {
            user_id: user.id,
            user_email: user.email,
        }
        
        const access_token = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "24h"
        });

        return {
            access_token,
            user_id: user.id,
            user_email: user.email,
        }
    }

}