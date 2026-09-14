import AppError from "../../domain/AppError";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import GetAllUsersOutput from "./GetAllUsersOutput";

export default class GetAllUsers {

    readonly userRepository: UserRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(): Promise<GetAllUsersOutput> {
        
        const response = await this.userRepository.getAll();
        
        if(!response.length) throw new AppError('Não há usuários');
        
        return {
            data: response
        }
    
    }
}