import AppError from "../../../domain/AppError";
import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface";
import UserController from "../../controller/UserController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";
import { LoginSchema } from "../schemas";
import requireAdmin from "../Middleware/requireAdmin";

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

        // LOGIN
        this.http.route("post", "/api/auth/login", false, async (_params: any, body: any, _user: any, _req: any, res: any) => {
            const parsed = LoginSchema.safeParse(body);
            if (!parsed.success) throw new AppError(parsed.error.errors[0].message);
            const result = await this.userController.login(parsed.data);
            const { accessToken, ...payload } = result as any;
            this.setCookies(res, accessToken, payload);
            res.json({ message: "Login realizado com sucesso" });
            return null;
        });

        // GET USERS — admin only
        this.http.route("get", "/api/users", true, async () => {
            return this.userController.getAll();
        }, requireAdmin)
    }
}