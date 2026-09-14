import AppError from "../../domain/AppError";
import User from "../../domain/Entity/User";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import FindUserByIdInput from "./FindUserByIdInput";
import FindUserByIdOutput from "./FindUserByIdOutput";

export default class FindUserById {

    readonly userRepository: UserRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: FindUserByIdInput): Promise<FindUserByIdOutput> {
        
        if(!input.userId) throw new AppError("ID do usuário não fornecido");
        
        const response = await this.userRepository.findById(input.userId);
        
        if (!response) throw new AppError("Usuário não encontrado");
        
        const user = new User(response.email, response.password, response.id)

        return { 
            user
        };
    }
}