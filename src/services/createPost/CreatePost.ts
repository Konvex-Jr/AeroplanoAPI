import AppError from "../../domain/AppError.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";
import Post from "../../domain/Entity/Post.js";

export interface CreatePostInput {
    title: string
    image: Buffer
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
        
        if (!input.title)   throw new AppError("Título é obrigatório.");
        if (!input.content) throw new AppError("Conteúdo é obrigatório.");

        const post = new Post(
            input.title,
            input.image,
            input.content,
            input.file_size,
            input.file_type,
            new Date(),
            new Date(),
            input.user_id
        );

        await this.postRepository.save(post);

        return { post };
    }
}
