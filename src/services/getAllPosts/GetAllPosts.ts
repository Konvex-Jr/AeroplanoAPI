import AppError from "../../domain/AppError.js";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";
import Post from "@/domain/Entity/Post.js";

export interface GetAllPostsOutput {
    data: Post[];
}

export default class GetAllPosts {

    readonly postRepository: PostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async execute(): Promise<GetAllPostsOutput> {
        
        const response = await this.postRepository.getAll()
        
        if(!response.length) throw new AppError("There's no Posts.")
    
        return { 
            data: response 
        }
    
    }
}