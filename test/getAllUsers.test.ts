import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreateUser from "../source/useCases/createUser/CreateUser";
import GetAllUsers from "../source/useCases/getAllUsers/GetAllUsers";

describe("GetAllUsers UseCase", () => {
  let repositoryFactory: RepositoryFactoryInterface;
  let createUser: CreateUser;
  let getAllUsers: GetAllUsers;


  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory()
    createUser = new CreateUser(repositoryFactory)
    getAllUsers = new GetAllUsers(repositoryFactory);
  });

  test("deve retornar todos os usuários", async () => {
    
    const input = {
      id: "1",
      email: "a@gmail.com",
      password: "senha12345678"
    }

    const acessToken = await createUser.execute(input)

    const result = await getAllUsers.execute();

    expect(result.data).toBeDefined()
  });

  test("deve lançar erro se não houver usuários", async () => {
    expect(async () => {
      await getAllUsers.execute()
    }).rejects.toThrow("Não há usuários")
  });
});