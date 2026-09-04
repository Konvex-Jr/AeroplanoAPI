import CreateUser from "../source/services/createUser/CreateUser";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";


describe("CreateUser UseCase", () => {
  
  let createUser: CreateUser;
  let repositoryFactory: RepositoryFactoryInterface

  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory()
    createUser = new CreateUser(repositoryFactory)
  });

  test("deve criar um usuário com sucesso", async () => {

    const input = { name: "John", email: "john.doe@konvex.com.br", password: "senha12345678" };

    const output = await createUser.execute(input);

    expect(output.accessToken).toBeDefined();
  });

  test("não deve criar usuário com senha inferior a 12 caracteres", async () => {

    const input = { name: "John", email: "john.doe@konvex.com.br", password: "12345" };

    expect(createUser.execute(input)).rejects.toThrow("A senha deve ter no mínimo 12 caracteres.");

  });
});
