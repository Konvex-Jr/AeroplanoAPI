import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import CreateUser from "../../services/createUser/CreateUser.js";
import LoginUser from "../../services/loginUser/LoginUser.js";
import { CreateUserInput, CreateUserOutput } from "../../services/createUser/CreateUser.js";
import { LoginUserInput, LoginUserOutput } from "@/services/loginUser/LoginUser.js";

export default class UserController {

    constructor(protected repositoryFactory: RepositoryFactoryInterface) {}

    async create(input: CreateUserInput): Promise<CreateUserOutput> {
        const createUser = new CreateUser(this.repositoryFactory);
        return await createUser.execute(input);
    }

    async login(input: LoginUserInput): Promise<CreateUserOutput> {
        const loginUser = new LoginUser(this.repositoryFactory);
        return await loginUser.execute(input);
    }
}