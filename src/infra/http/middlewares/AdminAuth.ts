import { verify } from "jsonwebtoken";
import { env } from "../../../env/index.js";

export default function adminAuth(request: any, response: any, next: any): any {
    const token = request.cookies?.['access-token'] ?? request.headers['access-token'];

    if (!token) { return response.status(403).json({ message: 'Token is required' }); }

    try {
        
        const publicKey = (env.JWT_PUBLIC_KEY ?? "").replace(/\\n/g, "\n");
        const data = verify(token, publicKey, { algorithms: ["RS256"] }) as { userId: string; userRole: string };

        if (data.userRole !== 'admin') {
            return response.status(403).json({ message: 'Acesso restrito ao administrador' });
        }

        request.userRole = data.userRole;
        return next();
    } catch {
        return response.status(401).json({ message: 'Invalid token' });
    }
}
