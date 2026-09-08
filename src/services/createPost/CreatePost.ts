import AppError from "../../domain/AppError.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";
import Post from "../../domain/Entity/Post.js";
import { NULL } from "@/infra/http/schemas.js";

export interface CreatePostInput {
    title: string
    image: Buffer | NULL
    content: string
    file_size: number
    file_type: string
    created_at: Date
    updated_at: Date
    user_id: string
}

export interface CreatePostOutput {
    post: Post
}

export default class CreatePost {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(input: CreatePostInput): Promise<CreatePostOutput> {

        const { title, image, content, file_size, file_type, created_at, updated_at, user_id } = input
        
        if (!title)   throw new AppError("Title is required.");
        
        if (!content) throw new AppError("Content is required.");

        const post = new Post(
            title,
            image,
            content,
            file_size,
            file_type,
            created_at,
            updated_at,
            user_id
        );

        await this.postRepository.save(post);

        return { post };
    }
}
