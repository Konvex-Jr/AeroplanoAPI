import fs from "fs";
import path from "path";
import AppError from "../../domain/AppError";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import CreateUserInput from "./CreateUserInput";
import CreateUserOutput from "./CreateUserOutput";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import User from "../../domain/Entity/User";

export default class CreateUser {

    readonly userRepository: UserRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: CreateUserInput): Promise<CreateUserOutput> {
        if (input.password.length < 12) throw new AppError("A senha deve ter no mínimo 12 caracteres.");

        const existing = await this.userRepository.findByEmail(input.email);
        if (existing) throw new AppError("Não foi possível criar a conta. Verifique os dados e tente novamente.");

        const encryptPassword = await hash(input.password, 10);
        const user = new User(input.email, encryptPassword, input?.id, input?.role ?? 'partner', input?.username ?? '');

        await this.userRepository.create(user);

        const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH ?? "";
        const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");

        const payload = {
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            username: user.username
        }
        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "24h"
        });

        return {
            accessToken,
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            username: user.username,
        }
    }

}