import AppError from "../../../domain/AppError.js";
import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface.js";
import UserController from "../../controller/UserController.js";
import Http from "../Http.js";
import ModelRoutes from "./ModelRoutes.js";
import adminAuth from "../middlewares/AdminAuth.js";
import { RegisterSchema, LoginSchema, UpdateUsernameSchema } from "../schemas.js";

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
    
        // GET USERS — admin only
        // this.http.route("get", "/api/users", true, async () => {
        //     return this.userController.getAll();
        // }, adminAuth)

        // GET USER BY ID
        // this.http.route("get", "/api/users/:userId", true, async (params: any, body: any) => {
        //     return this.userController.findById(params);
        // })

        // UPDATE USERNAME - authenticated user updates own username
        // this.http.route("patch", "/api/users/:userId/username", true, async (params: any, body: any, user: any) => {
        //     if (user.id !== params.userId) throw new AppError("Sem permissão para alterar este usuário");
        //     const parsed = UpdateUsernameSchema.safeParse(body);
        //     if (!parsed.success) throw new AppError("Erro ao atualizar usuário.");
        //     return this.userController.updateUsername(params.userId, parsed.data.username);
        // })
    }
}