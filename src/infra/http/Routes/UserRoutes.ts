import AppError from "../../../domain/AppError.js";
import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface.js";
import UserController from "../../controller/UserController.js";
import Http from "../Http.js";
import ModelRoutes from "./ModelRoutes.js";
import adminAuth from "../middlewares/UserAuth.js";
import { RegisterSchema, LoginSchema } from "../schemas.js";

export default class UserRoutes implements ModelRoutes {

    protected userController: UserController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.userController = new UserController(repositoryFactory);
    }

    private setCookies(res: any, accessToken: string, payload: any): void {
        const isProd = process.env.NODE_ENV === 'production';
        const cookieOpts = { httpOnly: true, secure: isProd, sameSite: 'strict' as const, maxAge: 24 * 60 * 60 * 1000 };
        res.cookie('access-token', accessToken, cookieOpts);
        res.cookie('user-payload', Buffer.from(JSON.stringify(payload)).toString('base64'), { secure: isProd, sameSite: 'strict' as const, maxAge: 24 * 60 * 60 * 1000 });
    }

    init(): void {

        // CREATE USER
        this.http.route("post", "/api/auth/register", false, async (_params: any, body: any, _user: any, _req: any, res: any) => {
            const parsed = RegisterSchema.parse(body);
            const result = await this.userController.create(parsed);
            const { accessToken, ...payload } = result as any;
            this.setCookies(res, accessToken, payload);
            res.status(201).json({ message: "Usuário criado com sucesso" });
            return null;
        });

        // LOGIN
        this.http.route("post", "/api/auth/login", false, async (_params: any, body: any, _user: any, _req: any, res: any) => {
            const parsed = LoginSchema.parse(body);
            const result = await this.userController.login(parsed);
            const { accessToken, ...payload } = result as any;
            this.setCookies(res, accessToken, payload);
            res.json({ message: "Login realizado com sucesso" });
            return null;
        });
    }
}