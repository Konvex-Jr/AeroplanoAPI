import AppError from "../../domain/AppError.js";
import crypto from "crypto";
import { CreatePostInput } from "../../services/createPost/CreatePost.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import CreatePost from "../../services/createPost/CreatePost.js";
import GetAllPosts from "../../services/getAllPosts/GetAllPosts.js";
import UpdatePost from "../../services/updatePost/UpdatePost.js";
import DeletePost from "../../services/deletePost/DeletePost.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";


export default class PostController {

    protected postRepository: PostRepositoryInterface;

    constructor(protected repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    // [ ] Implementar 

    async create(body: any, file: Express.Multer.File, user_id: any) {
        const { title, description, image } = body;

        if (!title || title.length < 1 || title.length > 255) throw new AppError("Título deve ter entre 1 e 255 caracteres");
        if (!description || description.length < 1 || description.length > 10000) throw new AppError("Descrição deve ter entre 1 e 10000 caracteres");

        // const sanitizedImage = await validateAndSanitizeImage(image ?? "");

        const createPost = new CreatePost(this.repositoryFactory);
        
        const result = await createPost.execute({
            title,
            content,
            image: file,
            content: sanitizedPdf,
            file_size: file.size,
            original_filename: file.originalname,
            username: user?.username ?? ""
        });

        const { content: _omit, ...metadata } = result.post as any;
        return { post: metadata };
    }

    async getAll() {
        const getAllPosts = new GetAllPosts(this.repositoryFactory);
        return await getAllPosts.execute();
    }

    async update(params: any, input: any) {
        const updatePost = new UpdatePost(this.repositoryFactory);
        return await updatePost.execute(params, input);
    }

    async delete(params: any, user: any) {
        const deletePost = new DeletePost(this.repositoryFactory);
        return await deletePost.execute({ id: params.id, userRole: user?.role ?? '' });
    }

}
