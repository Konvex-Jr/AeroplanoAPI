import fs from "fs";
import path from "path";
import AppError from "../../domain/AppError";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import LoginUserInput from "./LoginUserInput";
import LoginUserOutput from "./LoginUserOutput";

export default class LoginUser {

    readonly userRepository: UserRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: LoginUserInput): Promise<LoginUserOutput> {

        const user = await this.userRepository.findByEmailWithPassword(input.email);

        const hashedPassword = await hash(input.password, 10);
        const isEqual = user ? await compare(input.password, user.password) : await compare(input.password, hashedPassword);

        if (!user || !isEqual) throw new AppError("Email ou senha inválidos");

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