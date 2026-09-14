import AppError from "../../domain/AppError";
import Post from "../../domain/Entity/Post";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";
import FindPostByDateInput from "./FindPostByDateInput";
import FindPostByDateOutput from "./FindPostByDateOutput";

export default class FindPostByDate {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(input: FindPostByDateInput): Promise<FindPostByDateOutput> {
        
        const search = input.search

        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

        if(!search) throw new AppError("Data não fornecida")

        if(!regex.test(search)) throw new AppError("Formato de data inválido")

        const response = await this.postRepository.findByDate(new Date(search + "T00:00:00"));

        if (!response?.length) throw new AppError("Post não encontrado")

        return {
            data: response
        }
    }
}