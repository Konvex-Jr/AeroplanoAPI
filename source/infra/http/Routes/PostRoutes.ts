import AppError from "../../../domain/AppError";
import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface";
import PostController from "../../controller/PostController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";
import adminAuth from "../Middleware/AdminAuth";
import multerUpload from "../Middleware/MulterConfig";
import { CreatePostSchema, UpdatePostSchema } from "../schemas";

export default class PostRoutes implements ModelRoutes {

    protected postController: PostController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.postController = new PostController(repositoryFactory);
    }

    init(): void {

        // CREATE POST - multipart/form-data, admin only
        this.http.route("post", "/api/posts", true, async (params: any, body: any, user: any, req: any, res: any) => {
            const parsed = CreatePostSchema.safeParse(req.body);
            if (!parsed.success) throw new AppError(parsed.error.errors[0].message);
            const result = await this.postController.create(parsed.data, req.file, user);
            res.status(201).json(result);
            return null;
        }, [adminAuth, multerUpload.single("pdf")]);

        // GET POSTS - public
        this.http.route("get", "/api/posts", false, async (params: any) => {
            if (params.search) {
                return await this.postController.findByDate({ search: params.search });
            }
            return await this.postController.getAll();
        });

        // GET POST BY ID - admin only
        this.http.route("get", "/api/posts/:id", true, async (params: any) => {
            return await this.postController.findById(params);
        }, adminAuth);

        // STREAM PDF - public
        this.http.route("get", "/api/posts/:id/pdf", false, async (params: any, _body: any, _user: any, req: any, res: any) => {
            return await this.postController.streamPdf(params.id, req, res);
        });

        // UPDATE POST - admin only
        this.http.route("put", "/api/posts/:id", true, async (params: any, body: any) => {
            const parsed = UpdatePostSchema.safeParse(body);
            if (!parsed.success) throw new AppError(parsed.error.errors[0].message);
            return await this.postController.update(params, parsed.data);
        }, adminAuth);

        // DELETE POST - admin only
        this.http.route("delete", "/api/posts/:id", true, async (params: any, _body: any, user: any) => {
            return await this.postController.delete(params, user);
        }, adminAuth);
    }
}
