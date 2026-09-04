import AppError from "../../domain/AppError.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";
import GetAllPostsOutput from "./GetAllPostsOutput.js";

export default class GetAllPosts {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(): Promise<GetAllPostsOutput> {
        
        const response = await this.postRepository.getAll()
        
        if(!response.length) throw new AppError("Não há posts")
    
        return { 
            data: response 
        }
    
    }
}