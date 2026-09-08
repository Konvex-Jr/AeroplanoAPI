import AppError from "../../domain/AppError.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import CreatePost from "../../services/createPost/CreatePost.js";
import GetAllPosts from "../../services/getAllPosts/GetAllPosts.js";
import UpdatePost from "../../services/updatePost/UpdatePost.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";

import { Request, Response } from "express"

import { DeletePost, DeletePostInput } from "../../services/deletePost/DeletePost.js";
import { UpdatePostInput } from "@/services/updatePost/UpdatePost.js";
import { CreatePostSchema, NULL, UNDEFINED } from "../http/schemas.js";

export default class PostController {

    protected postRepository: PostRepositoryInterface;

    constructor(protected repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async create(req: Request, file: Express.Multer.File | UNDEFINED, user_id: string) {

        const { title, content } = CreatePostSchema.parse(req.body);

        if (!title || title.length < 1 || title.length > 255) throw new AppError("Title should contain between 1 - 255 characters.");
        
        if (!content || content.length < 1 || content.length > 10000) throw new AppError("Content should contain between 1 - 255 characters.");

        const createPost = new CreatePost(this.repositoryFactory);
        
        let arrayBuffer: Buffer | NULL = null

        if(file){ arrayBuffer = file.buffer }

        const buffer = arrayBuffer ? Buffer.from(arrayBuffer) : null

        const result = await createPost.execute({
            title,
            content,
            image: buffer ? buffer : null,
            file_size: file ? file.size : 0,
            file_type: file ? file.mimetype : 'null',
            created_at: new Date(),
            updated_at: new Date(),
            user_id: user_id
        });

        const { post } = result;
        
        return { post };
    }

    async getAll() {
        const getAllPosts = new GetAllPosts(this.repositoryFactory);
        return await getAllPosts.execute();
    }

    async update(input: UpdatePostInput) {
        const updatePost = new UpdatePost(this.repositoryFactory);
        return await updatePost.execute(input);
    }

    async delete(input: DeletePostInput) {
        const deletePost = new DeletePost(this.repositoryFactory);
        return await deletePost.execute(input);
    }

}
