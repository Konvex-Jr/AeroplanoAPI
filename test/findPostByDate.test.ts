import FindPostByDate from "../source/useCases/findPostByDate/FindPostByDate";
import FindPostByDateInput from "../source/useCases/findPostByDate/FindPostByDateInput";
import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import CreatePost from "../source/useCases/createPost/CreatePost";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreatePostInput from "../source/useCases/createPost/CreatePostInput";

const fakePdf = Buffer.from("%PDF-fake");

const baseInput: CreatePostInput = {
  title: "title-test",
  description: "description-test",
  image: "",
  content: fakePdf,
  file_size: fakePdf.length,
  original_filename: "test.pdf"
};

describe("FindPostByDate UseCase", () => {

  let repositoryFactory: RepositoryFactoryInterface;
  let findPostByDate: FindPostByDate;
  let createPost: CreatePost;

  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory();
    findPostByDate = new FindPostByDate(repositoryFactory);
    createPost = new CreatePost(repositoryFactory);
  });

  test("deve lançar erro se data não for fornecida", async () => {
    await expect(findPostByDate.execute({} as any)).rejects.toThrow("Data não fornecida");
  });

  test("deve lançar erro se post não encontrado", async () => {
    await createPost.execute(baseInput);
    const inputDate: FindPostByDateInput = { search: "2024-11-20" };
    await expect(findPostByDate.execute(inputDate)).rejects.toThrow("Post não encontrado");
  });

  test("deve retornar um post quando a data existe", async () => {
    const newPostResponse = await createPost.execute(baseInput);
    const d = newPostResponse.post.created_at;
    const inputDate: FindPostByDateInput = {
      search: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    };
    const result = await findPostByDate.execute(inputDate);
    expect(result).toBeDefined();
  });
});
