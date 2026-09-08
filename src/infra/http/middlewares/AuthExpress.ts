import Auth from "./Auth.js";
import RepositoryFactoryInterface from "../../../domain/Interfaces/RepositoryFactoryInterface.js";
import UserRepositoryInterface from "../../../domain/Interfaces/UserRepositoryInterface.js";
import jwt from "jsonwebtoken"
import { getAccessToken } from "@/infra/utils/getAccessToken.js";
import { Request, Response } from "express"

const { verify } = jwt

export default class ExpressAuth implements Auth {

    protected userRepository: UserRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
    }
    
    async execute(req: Request, res: Response, next: any): Promise<any> {
        
        const token = getAccessToken(req);

        if (!token) {
            return res.status(403).json({
                message: 'Token is Required.'
            });
        }

        try {
            
            const publicKey = (process.env.JWT_PUBLIC_KEY ?? "").replace(/\\n/g, "\n");
            
            const { userId, userEmail } = verify(token, publicKey, { algorithms: ["RS256"] }) as { userId: string; userEmail: string };
            const user = await this.userRepository.findById(userId);
            
            if(!user){
                return res.status(403).json({ message: "Unauthorized." })
            }

            res.locals = { userId, userEmail }

            return next();
        
        } catch (e) {
            return res.status(401).json({
                message: 'Invalid Token.'
            });
        }
    }

}