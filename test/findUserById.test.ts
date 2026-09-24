import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreateUser from "../source/useCases/createUser/CreateUser";
import FindUserById from "../source/useCases/findUserById/FindUserById";

describe("FindUserById UseCase", () => {
  let findUserById: FindUserById;
  let repositoryFactory: RepositoryFactoryInterface;
  let createUser: CreateUser

  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory()
    findUserById = new FindUserById(repositoryFactory);
    createUser = new CreateUser(repositoryFactory)
  });

  test("deve lançar erro quando o userId não for fornecido", async () => {
    await expect(findUserById.execute({ userId: "" } as any)).rejects.toThrow("ID do usuário não fornecido");
  });

  test("deve lançar erro quando o usuário não for encontrado", async () => {
    await expect(findUserById.execute({ userId: "1" } as any)).rejects.toThrow("Usuário não encontrado");
  });

  test("deve encontrar um usuário pelo ID", async () => {

    const inputUser = { id: "1", email: "john.doe@example.com", password: "senha12345678" };

    const acessToken = await createUser.execute(inputUser)

    const userID = {
      userId: "1"
    }

    const findedUser = await findUserById.execute(userID)

    expect(findedUser).toBeDefined()

  });
});