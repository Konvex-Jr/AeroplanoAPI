import AppError from "../../domain/AppError";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import CreateUser from "../../useCases/createUser/CreateUser";
import CreateUserInput from "../../useCases/createUser/CreateUserInput";
import CreateUserOutput from "../../useCases/createUser/CreateUserOutput";
import FindUserById from "../../useCases/findUserById/FindUserById";
import FindUserByIdInput from "../../useCases/findUserById/FindUserByIdInput";
import FindUserByIdOutput from "../../useCases/findUserById/FindUserByIdOutput";
import GetAllUsers from "../../useCases/getAllUsers/GetAllUsers";
import GetAllUsersOutput from "../../useCases/getAllUsers/GetAllUsersOutput";
import LoginUser from "../../useCases/loginUser/LoginUser";
import LoginUserInput from "../../useCases/loginUser/LoginUserInput";

export default class UserController {

    constructor(protected repositoryFactory: RepositoryFactoryInterface) {
    }

    async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
        const createUser = new CreateUser(this.repositoryFactory);
        return await createUser.execute(input);
    }

    async login(input: LoginUserInput): Promise<{ accessToken: string }> {
        const loginUser = new LoginUser(this.repositoryFactory);
        return await loginUser.execute(input);
    }

    async getAll(): Promise<GetAllUsersOutput> {
        const getAllUsers = new GetAllUsers(this.repositoryFactory);
        return await getAllUsers.execute();
    }

    async findById(input: FindUserByIdInput): Promise<FindUserByIdOutput> {
        const findById = new FindUserById(this.repositoryFactory);
        return await findById.execute(input);
    }

    async getPartners(): Promise<{ data: { id: string; username: string }[] }> {
        const repo = this.repositoryFactory.createUserRepository();
        const all = await repo.getAll();
        const partners = all
            .filter(u => u.role === 'partner')
            .map(u => ({ id: u.id, username: u.username || u.email.split('@')[0] }));
        return { data: partners };
    }

    async updateUsername(userId: string, username: string): Promise<{ message: string }> {
        if (!username || username.trim().length === 0) throw new AppError("Username não pode ser vazio");
        const repo = this.repositoryFactory.createUserRepository();
        const user = await repo.findById(userId);
        if (!user) throw new AppError("Usuário não encontrado");
        await (repo as any).updateUsername(userId, username.trim());
        return { message: "Username atualizado com sucesso" };
    }
}