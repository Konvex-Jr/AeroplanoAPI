import fs from "fs";
import path from "path";
import { verify } from "jsonwebtoken";
import Auth from "./Auth";
import RepositoryFactoryInterface from "../../../domain/Interfaces/RepositoryFactoryInterface";
import UserRepositoryInterface from "../../../domain/Interfaces/UserRepositoryInterface";

export default class AuthExpress implements Auth {

    protected userRepository: UserRepositoryInterface;
    private readonly publicKey: string;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
        this.publicKey = fs.readFileSync(
            path.resolve(process.env.JWT_PUBLIC_KEY_PATH ?? ""),
            "utf8"
        );
    }

    async execute(request: any, response: any, next: any): Promise<any> {
        const token = request.cookies?.['access-token'] ?? request.headers['access-token'];

        if (!token) {
            return response.status(401).json({ message: 'Token is required' });
        }

        try {
            const data = verify(token, this.publicKey, { algorithms: ["RS256"] }) as { userId: string; userRole: string };
            const user = await this.userRepository.findById(data.userId);

            if (!user) {
                return response.status(401).json({ message: 'Invalid token' });
            }

            request.user = user;
            request.userRole = data.userRole;
            return next();
        } catch (e) {
            console.log("JWT verify error:", (e as Error).message);
            return response.status(401).json({ message: 'Invalid token' });
        }
    }

}