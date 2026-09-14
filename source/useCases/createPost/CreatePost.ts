import AppError from "../../domain/AppError";
import CreatePostInput from "./CreatePostInput";
import CreatePostOutput from "./CreatePostOutput";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";
import Post from "../../domain/Entity/Post";

export default class CreatePost {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(input: CreatePostInput): Promise<CreatePostOutput> {
        if (!input.title) throw new AppError("Título é obrigatório");

        const post = new Post(
            input.title,
            input.description,
            input.image,
            input.file_size,
            input.original_filename,
            new Date(),
            new Date(),
            null,
            undefined,
            input.username ?? '',
            input.content
        );

        await this.postRepository.save(post);

        return { post };
    }
}
