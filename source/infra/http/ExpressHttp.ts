import express from "express";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import Auth from "./Middleware/Auth";
import Http from "./Http";
import HttpMethods from "./HttpMethods";
import AppError from "../../domain/AppError";

export default class ExpressHttp implements Http {

    private app: any;
    private auth: Auth;

    constructor(auth: Auth) {
        this.app = express();
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(cookieParser());

        this.app.use(rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
            message: { message: "Muitas requisições. Tente novamente em alguns minutos." },
        }));

        this.app.use(["/api/auth/login", "/api/auth/register"], rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 10,
            standardHeaders: true,
            legacyHeaders: false,
            message: { message: "Muitas tentativas de autenticação. Tente novamente em 15 minutos." },
        }));

        const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

        this.app.use((req: any, res: any, next: any) => {
            res.header('Access-Control-Allow-Origin', corsOrigin);
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, access-token');
            res.header('Access-Control-Allow-Credentials', 'true');
            if (req.method === 'OPTIONS') return res.sendStatus(204);
            next();
        });

        this.auth = auth;
    }

    private async publicRoutes(method: HttpMethods, url: string, callback: any, middlewares: any[] = []): Promise<any> {
        this.app[method](url, ...middlewares, async function (req: any, res: any) {
            try {
                const { search } = req.query;
                req.params["search"] = search;
                const result = await callback(req.params, req.body, null, req, res);
                if (result === null) return;
                res.json(result);
            } catch (exception: any) {
                if (exception instanceof AppError) {
                    res.status(422).json({ message: exception.message });
                } else {
                    console.error(exception);
                    res.status(500).json({ message: 'Ocorreu um erro interno. Tente novamente mais tarde.' });
                }
            }
        });
    }

    private async privateRoutes(method: string, url: string, callback: any, middlewares: any[] = []): Promise<any> {
        const allMiddlewares = [this.auth.execute.bind(this.auth), ...middlewares];

        this.app[method](url, ...allMiddlewares, async function (req: any, res: any) {
            try {
                const { search } = req.query;
                req.params["search"] = search;
                const result = await callback(req.params, req.body, req.user, req, res);
                if (result === null) return;
                res.json(result);
            } catch (exception: any) {
                if (exception instanceof AppError) {
                    res.status(422).json({ message: exception.message });
                } else {
                    console.error(exception);
                    res.status(500).json({ message: 'Ocorreu um erro interno. Tente novamente mais tarde.' });
                }
            }
        });
    }

    async route(method: HttpMethods, url: string, auth: boolean, callback: any, middleware?: any): Promise<any> {
        const middlewares = middleware ? (Array.isArray(middleware) ? middleware : [middleware]) : [];
        if (auth) this.privateRoutes(method, url, callback, middlewares);
        else this.publicRoutes(method, url, callback, middlewares);
    }

    async listen(port: number): Promise<void> {
        await this.app.listen(port);
    }
}
