import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreatePost from "../source/services/createPost/CreatePost";
import CreatePostInput from "../source/services/createPost/CreatePostInput";
import GetAllPosts from "../source/services/getAllPosts/GetAllPosts";

const fakePdf = Buffer.from("%PDF-fake");

describe("GetAllPosts UseCase", () => {
  let repositoryFactory: RepositoryFactoryInterface;
  let createPost: CreatePost;
  let getAllPosts: GetAllPosts;

  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory();
    createPost = new CreatePost(repositoryFactory);
    getAllPosts = new GetAllPosts(repositoryFactory);
  });

  test("deve retornar todos os posts", async () => {
    const inputs: CreatePostInput[] = [
      { title: "title-test", description: "description-test", image: "", content: fakePdf, file_size: fakePdf.length, original_filename: "a.pdf" },
      { title: "title-test2", description: "description-test2", image: "", content: fakePdf, file_size: fakePdf.length, original_filename: "b.pdf" }
    ];

    for (const input of inputs) {
      await createPost.execute(input);
    }

    const response = await getAllPosts.execute();
    expect(response.data).toBeDefined();
  });

  test("deve lançar erro se não houver posts", async () => {
    expect(async () => {
      await getAllPosts.execute();
    }).rejects.toThrow("Não há posts");
  });
});
