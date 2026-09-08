import AppError from "../../domain/AppError.js";
import { compare, hash } from "bcrypt";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import jwt from "jsonwebtoken";

const { sign } = jwt

export interface LoginUserInput {
    email: string;
    password: string;
}

export interface LoginUserOutput {
    access_token: string;
    user_id: string;
    user_email: string;
} 

export default class LoginUser {

    readonly userRepository: UserRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: LoginUserInput): Promise<LoginUserOutput> {
        
        const user = await this.userRepository.findByEmailWithPassword(input.email);

        // Run hashing to prevent USER ENUMERATION

        const dummyHash = await hash("dummy", 10);
        
        const isEqual = user ? await compare(input.password, user.password) : await compare(input.password, dummyHash);

        if (!user || !isEqual) throw new AppError("Invalid email and/or password.");
        
        const privateKey = (process.env.JWT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
        
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