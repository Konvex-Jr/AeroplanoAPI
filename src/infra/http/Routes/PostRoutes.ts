import RepositoryFactory from "../../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostController from "../../controller/PostController.js";
import Http from "../Http.js";
import ModelRoutes from "./ModelRoutes.js";
import fileUpload from "../middlewares/Multer.js";
import { Request, Response } from "express"
import userAuth from "../middlewares/UserAuth.js";
import { DeletePostSchema, NULL, UNDEFINED, UpdatePostSchema } from "../schemas.js";

export default class PostRoutes implements ModelRoutes {

    protected postController: PostController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.postController = new PostController(repositoryFactory);
    }

    init(): void {

        // GET ALL POSTS - Public
        this.http.route("get", "/api/posts", false, async () => {
            return await this.postController.getAll();
        });

        // CREATE POST - multipart/form-data - private
        this.http.route("post", "/api/posts", true, async (request: Request, response: Response) => {
            
            const { userId } = response.locals

            let file: Express.Multer.File | UNDEFINED

            if(request.file) file = request.file 

            const result = await this.postController.create(request, file, userId);

            return response.status(201).json(result);

        }, [ userAuth, fileUpload.single("file")]);

        // UPDATE POST - multipart/form-data - Private
        this.http.route("put", "/api/posts/:id", true, async (req: Request, res: Response ) => {
            
            const { id } = req.params

            if(!id) return res.status(404).send({ message: "Post Not Found." })
            
            const body = UpdatePostSchema.parse(req.body);
            
            const parsed = {
                id,
                ...body
            }

            return await this.postController.update(parsed);
        }, [ userAuth ]);

        // DELETE POST - multipart/form-data - Private
        this.http.route("delete", "/api/posts/:id", true, async (req: Request, res: Response) => {

            const parsed = DeletePostSchema.parse(req.params)

            return await this.postController.delete(parsed);

        }, [ userAuth ]);
    }
}
