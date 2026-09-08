import jwt from "jsonwebtoken";
import { env } from "@/env/index.js";
import { getAccessToken } from "@/infra/utils/getAccessToken.js";
import { Request, Response } from "express"

const { verify } = jwt

export default function userAuth(req: Request, res: Response, next: any): any {
    
    const token = getAccessToken(req);

    if (!token) { return res.status(403).json({ message: 'Token is Required.' }); }

    try {
        
        const publicKey = (env.JWT_PUBLIC_KEY ?? "").replace(/\\n/g, "\n");
        const data = verify(token, publicKey, { algorithms: ["RS256"] }) as { userId: string; userEmail: string };

        const { userId, userEmail } = data
        
        if(!userId || !userEmail){
            return res.status(403).json({ message: "Unauthorized." })
        }

        res.locals = { userId, userEmail }

        return next();

    } catch {

        return res.status(401).json({ message: 'Invalid Token.' });

    }
}
