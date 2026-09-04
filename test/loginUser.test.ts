import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreateUser from "../source/services/createUser/CreateUser";
import LoginUser from "../source/services/loginUser/LoginUser";

describe("LoginUser use case", () => {
    let loginUser: LoginUser;
    let repositoryFactory: RepositoryFactoryInterface;

    beforeEach(() => {
        repositoryFactory = new MemoryRepositoryFactory();
        loginUser = new LoginUser(repositoryFactory);
    });

    test("Deve falhar se o usuário não existir", async () => {
        expect(async () => {
            await loginUser.execute({ email: "no.user@gmail.com.br", password: "123456" })
        }).rejects.toThrow("Email ou senha inválidos");
    });

    test("Deve falhar se a senha estiver incorreta", async () => {

        const createUser = new CreateUser(repositoryFactory);

        const userInput = {
            id: "1",
            email: "john.doe@gmail.com.br",
            password: "senha12345678",
        };

        await createUser.execute(userInput);

        expect(async () => {
            await loginUser.execute({ email: "john.doe@gmail.com.br", password: "senhaErrada123" })
        }).rejects.toThrow("Email ou senha inválidos");

    });

    test("Deve gerar um token para usuário válido", async () => {
        const createUser = new CreateUser(repositoryFactory);
        const userInput = {
            email: "john.doe@gmail.com.br",
            password: "senha12345678",
        };
        await createUser.execute(userInput);
        const loginOutput = await loginUser.execute({
            email: "john.doe@gmail.com.br",
            password: "senha12345678",
        });

        expect(loginOutput.accessToken).toBeDefined();
    });
});