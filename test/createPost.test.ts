import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreatePost from "../source/services/createPost/CreatePost";
import CreatePostInput from "../source/services/createPost/CreatePostInput";

const fakePdf = Buffer.from("%PDF-fake");

describe("CreatePost UseCase", () => {

  let createPost: CreatePost
  let repositoryFactory: RepositoryFactoryInterface

  beforeAll(() => {
    repositoryFactory = new MemoryRepositoryFactory()
  })

  beforeEach(() => {
    createPost = new CreatePost(repositoryFactory)
  })

  test("deve criar um post com sucesso", async () => {

    const input: CreatePostInput = {
      title: "title-test",
      description: "description-test",
      image: "",
      content: fakePdf,
      file_size: fakePdf.length,
      original_filename: "test.pdf"
    }

    const response = await createPost.execute(input)

    expect(response.post.id).toBeDefined()
    expect(response.post.title).toBeDefined()
    expect(response.post.description).toBeDefined()

  });

  test("não deve criar um post caso não seja fornecido um título", async () => {

    const input: CreatePostInput = {
      title: "",
      description: "description-test",
      image: "",
      content: fakePdf,
      file_size: fakePdf.length,
      original_filename: "test.pdf"
    }

    expect(async () => {
      await createPost.execute(input)
    }).rejects.toThrow("Título é obrigatório")

  });
});
