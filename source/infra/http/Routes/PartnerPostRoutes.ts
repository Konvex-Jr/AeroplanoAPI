import AppError from "../../../domain/AppError";
import RepositoryFactoryInterface from "../../../domain/Interfaces/RepositoryFactoryInterface";
import PartnerPostController from "../../controller/PartnerPostController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";
import multerUpload from "../Middleware/MulterConfig";
import { CreatePostSchema, UpdatePostSchema } from "../schemas";

export default class PartnerPostRoutes implements ModelRoutes {

    protected controller: PartnerPostController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactoryInterface) {
        this.controller = new PartnerPostController(repositoryFactory);
    }

    init(): void {

        // CREATE PARTNER POST - multipart/form-data, any authenticated user
        this.http.route("post", "/api/partner-posts", true, async (_params: any, _body: any, user: any, req: any, res: any) => {
            const parsed = CreatePostSchema.safeParse(req.body);
            if (!parsed.success) throw new AppError(parsed.error.errors[0].message);
            const result = await this.controller.create(user.id, parsed.data, req.file);
            res.status(201).json(result);
            return null;
        }, [multerUpload.single("pdf")]);

        // GET ALL PARTNER POSTS - public
        this.http.route("get", "/api/partner-posts", false, async () => {
            return await this.controller.getAll();
        });

        // STREAM PARTNER POST PDF - public
        this.http.route("get", "/api/partner-posts/:id/pdf", false, async (params: any, _body: any, _user: any, req: any, res: any) => {
            return await this.controller.streamPdf(params.id, req, res);
        });

        // UPDATE PARTNER POST - owner only
        this.http.route("put", "/api/partner-posts/:id", true, async (params: any, body: any, user: any) => {
            const parsed = UpdatePostSchema.safeParse(body);
            if (!parsed.success) throw new AppError(parsed.error.errors[0].message);
            return await this.controller.update(user.id, params, parsed.data);
        });

        // DELETE PARTNER POST - owner only
        this.http.route("delete", "/api/partner-posts/:id", true, async (params: any, _body: any, user: any) => {
            return await this.controller.delete(user.id, params);
        });
    }
}
