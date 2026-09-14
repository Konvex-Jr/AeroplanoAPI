import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreatePost from "../source/useCases/createPost/CreatePost";
import CreatePostInput from "../source/useCases/createPost/CreatePostInput";
import UpdatePost from "../source/useCases/updatePost/UpdatePost";
import UpdatePostInput from "../source/useCases/updatePost/UpdatePostInput";

const fakePdf = Buffer.from("%PDF-fake");

const baseInput: CreatePostInput = {
  title: "title-test",
  description: "description-test",
  image: "",
  content: fakePdf,
  file_size: fakePdf.length,
  original_filename: "test.pdf"
};

describe("UpdatePost UseCase", () => {
  let repositoryFactory: RepositoryFactoryInterface;
  let updatePost: UpdatePost;
  let createPost: CreatePost;

  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory();
    updatePost = new UpdatePost(repositoryFactory);
    createPost = new CreatePost(repositoryFactory);
  });

  test("deve lançar erro se ID não for fornecido", async () => {
    const input: UpdatePostInput = { title: "new-title", description: "new-desc", image: "" };
    expect(async () => {
      await updatePost.execute({ id: "" }, input);
    }).rejects.toThrow("ID do post não fornecido");
  });

  test("deve lançar erro se post não encontrado", async () => {
    const input: UpdatePostInput = { title: "new-title", description: "new-desc", image: "" };
    expect(async () => {
      await updatePost.execute({ id: "546545cb-7948-45eb-9d34-436749824d46" }, input);
    }).rejects.toThrow("Post não encontrado");
  });

  test("deve lançar erro se ID não estiver no formato correto", async () => {
    const input: UpdatePostInput = { title: "new-title", description: "new-desc", image: "" };
    expect(async () => {
      await updatePost.execute({ id: "546545cb-45eb-9d34" }, input);
    }).rejects.toThrow("Formato de ID incorreto");
  });

  test("deve atualizar um post existente", async () => {
    const newPost = await createPost.execute(baseInput);
    const inputUpdate: UpdatePostInput = { title: "new-title-test", description: "new-description-test", image: "" };
    const response = await updatePost.execute({ id: newPost.post.id }, inputUpdate);
    expect(response.post).toBeDefined();
  });

  test("não deve atualizar um post caso não seja fornecido o título", async () => {
    const newPost = await createPost.execute(baseInput);
    const inputUpdate: UpdatePostInput = { title: "", description: "new-description-test", image: "" };
    expect(async () => {
      await updatePost.execute({ id: newPost.post.id }, inputUpdate);
    }).rejects.toThrow("Título é obrigatório");
  });
});
