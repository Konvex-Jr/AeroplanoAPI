import AppError from "../../../domain/AppError";
import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface";
import PostController from "../../controller/PostController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";
import { CreatePostSchema, UpdatePostSchema } from "../schemas";
import requireAdmin from "../Middleware/requireAdmin";

export default class PostRoutes implements ModelRoutes {

    protected postController: PostController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.postController = new PostController(repositoryFactory);
    }

    init(): void {

        // CREATE POST - JSON { title, description, image (data URI base64) }, admin only
        this.http.route("post", "/api/posts", true, async (_params: any, body: any, _user: any, _req: any, res: any) => {
            const parsed = CreatePostSchema.safeParse(body);
            if (!parsed.success) throw new AppError(parsed.error.errors[0].message);
            const result = await this.postController.create(parsed.data);
            res.status(201).json(result);
            return null;
        }, requireAdmin);

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
        }, requireAdmin);

        // UPDATE POST - admin only (image opcional: sem ela, mantém a capa atual)
        this.http.route("put", "/api/posts/:id", true, async (params: any, body: any) => {
            const parsed = UpdatePostSchema.safeParse(body);
            if (!parsed.success) throw new AppError(parsed.error.errors[0].message);
            return await this.postController.update(params, parsed.data);
        }, requireAdmin);

        // DELETE POST - admin only
        this.http.route("delete", "/api/posts/:id", true, async (params: any, _body: any, user: any) => {
            return await this.postController.delete(params, user);
        }, requireAdmin);
    }
}