import AppError from "../../domain/AppError.js";
import Post from "../../domain/Entity/Post.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";

export interface UpdatePostInput {
    id: string
    title: string
    image: Buffer
    content: string
}

export interface UpdatePostOutput {
    post: Post;
}

export default class UpdatePost {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(input: UpdatePostInput): Promise<UpdatePostOutput> {
        
        const { id, title, image, content } = input

        if (!id) throw new AppError("ID do post não fornecido.");

        const REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        
        if (!REGEX.test(id)) throw new AppError("Formato de ID incorreto.");

        if (!(await this.postRepository.findById(id))) throw new AppError("Post não encontrado");

        const post = await this.postRepository.update(id, title, image, content);

        return { post };
    }
}
