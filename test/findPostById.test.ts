import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreatePost from "../source/useCases/createPost/CreatePost";
import CreatePostInput from "../source/useCases/createPost/CreatePostInput";
import FindPostById from "../source/useCases/findPostById/FindPostById";
import FindPostByIdInput from "../source/useCases/findPostById/FindPostByIdInput";

const fakePdf = Buffer.from("%PDF-fake");

const baseInput: CreatePostInput = {
  title: "title-test",
  description: "description-test",
  image: "",
  content: fakePdf,
  file_size: fakePdf.length,
  original_filename: "test.pdf"
};

describe("FindPostById UseCase", () => {

  let findPostById: FindPostById;
  let repositoryFactory: RepositoryFactoryInterface;
  let createPost: CreatePost;

  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory();
    findPostById = new FindPostById(repositoryFactory);
    createPost = new CreatePost(repositoryFactory);
  });

  test("deve retornar um post quando o ID existe", async () => {
    const newPostResponse = await createPost.execute(baseInput);
    expect(newPostResponse.post).toBeDefined();
    const inputFindById: FindPostByIdInput = { id: newPostResponse.post.id };
    const response = await findPostById.execute(inputFindById);
    expect(response.post).toBeDefined();
  });

  test("deve lançar erro se ID não for fornecido", async () => {
    await expect(findPostById.execute({} as any)).rejects.toThrow("ID do post não fornecido");
  });

  test("deve lançar erro se ID não estiver no formato correto", async () => {
    await expect(findPostById.execute({ id: "123-abc-456-789" } as any)).rejects.toThrow("Formato de ID incorreto");
  });

  test("deve lançar erro se post não encontrado", async () => {
    await createPost.execute(baseInput);
    const inputFindById: FindPostByIdInput = { id: "2515a378-3651-4372-b61f-bfbdffb6486c" };
    await expect(findPostById.execute(inputFindById)).rejects.toThrow("Post não encontrado");
  });
});
