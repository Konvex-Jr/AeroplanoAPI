import AppError from "../../domain/AppError";
import Post from "../../domain/Entity/Post";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";
import UpdatePostInput from "./UpdatePostInput";
import UpdatePostOutput from "./UpdatePostOutput";

export default class UpdatePost {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(params: any, input: UpdatePostInput): Promise<UpdatePostOutput> {
        const { id } = params;

        if (!id) throw new AppError("ID do post não fornecido");

        const REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!REGEX.test(id)) throw new AppError("Formato de ID incorreto");

        if (!input.title) throw new AppError("Título é obrigatório");

        if (!(await this.postRepository.findById(id))) throw new AppError("Post não encontrado");

        const post = await this.postRepository.update(id, input.title, input.description, input.image);

        return { post };
    }
}
