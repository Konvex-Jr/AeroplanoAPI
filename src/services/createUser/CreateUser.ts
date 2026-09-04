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

        if (password.length < 8) throw new AppError("A senha deve ter no mínimo 8 caracteres.");

        const existing = await this.userRepository.findByEmail(input.email);

        if (existing) throw new AppError("Não foi possível criar a conta. Verifique os dados e tente novamente.");

        const encryptPassword = await hash(input.password, 12);

        const user = new User(input.email, encryptPassword);

        await this.userRepository.create(user);

        const privateKey = (env.JWT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

        const payload = {
            userId: user.id,
            userEmail: user.email,
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