import AppError from "../../../domain/AppError.js";
import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostController from "../../controller/PostController.js";
import Http from "../Http.js";
import ModelRoutes from "./ModelRoutes.js";
import adminAuth from "../middlewares/AdminAuth.js";
import multerUpload from "../middlewares/MulterConfig.js";
import { CreatePostSchema, UpdatePostSchema } from "../schemas.js";

export default class PostRoutes implements ModelRoutes {

    protected postController: PostController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.postController = new PostController(repositoryFactory);
    }

    init(): void {

        // CREATE POST - multipart/form-data, admin only
        // this.http.route("post", "/api/posts", true, async (params: any, body: any, user: any, req: any, res: any) => {
        //     const parsed = CreatePostSchema.parse(req.body);
        //     const result = await this.postController.create(parsed, req.file, user);
        //     res.status(201).json(result);
        //     return null;
        // }, [adminAuth, multerUpload.single("pdf")]);

        // GET POSTS - public
        // this.http.route("get", "/api/posts", false, async (params: any) => {
        //     if (params.search) {
        //         return await this.postController.findByDate({ search: params.search });
        //     }
        //     return await this.postController.getAll();
        // });

        // GET POST BY ID - admin only
        // this.http.route("get", "/api/posts/:id", true, async (params: any) => {
        //     return await this.postController.findById(params);
        // }, adminAuth);

        // STREAM PDF - public
        // this.http.route("get", "/api/posts/:id/pdf", false, async (params: any, _body: any, _user: any, req: any, res: any) => {
        //     return await this.postController.streamPdf(params.id, req, res);
        // });

        // UPDATE POST - admin only
        // this.http.route("put", "/api/posts/:id", true, async (params: any, body: any) => {
        //     const parsed = UpdatePostSchema.parse(body);
        //     return await this.postController.update(params, parsed);
        // }, adminAuth);

        // DELETE POST - admin only
        // this.http.route("delete", "/api/posts/:id", true, async (params: any, _body: any, user: any) => {
        //     return await this.postController.delete(params, user);
        // }, adminAuth);
    }
}
