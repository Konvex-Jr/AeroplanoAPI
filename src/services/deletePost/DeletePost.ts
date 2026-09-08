import AppError from "../../domain/AppError.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";

export interface DeletePostInput {
    id: string;
}

export interface DeletePostOutput {
    message: string
}

export class DeletePost {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(input: DeletePostInput): Promise<DeletePostOutput> {
        
        const { id } = input

        const REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        if(!REGEX.test(id)) throw new AppError("Post not found.")

        if(!(await this.postRepository.findById(id))) throw new AppError("Post not found.")

        await this.postRepository.delete(id)

        return {
            message: "Deleted Successfully."
        }
    }

}