import RepositoryFactoryInterface from "../source/domain/Interfaces/RepositoryFactoryInterface";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreatePost from "../source/useCases/createPost/CreatePost";
import CreatePostInput from "../source/useCases/createPost/CreatePostInput";
import DeletePost from "../source/useCases/deletePost/DeletePost";

const fakePdf = Buffer.from("%PDF-fake");

const baseInput: CreatePostInput = {
  title: "title-test",
  description: "description-test",
  image: "",
  content: fakePdf,
  file_size: fakePdf.length,
  original_filename: "test.pdf"
};

describe("DeletePost UseCase", () => {
  let repositoryFactory: RepositoryFactoryInterface;
  let deletePost: DeletePost;

  beforeEach(() => {
    repositoryFactory = new MemoryRepositoryFactory();
    deletePost = new DeletePost(repositoryFactory);
  });

  test("deve lançar erro se ID não estiver no formato correto", async () => {
    expect(async () => {
      await deletePost.execute({ id: '1', userRole: 'admin' });
    }).rejects.toThrow("Formato de ID incorreto");
  });

  test("lança erro caso não encontre um post", async () => {
    expect(async () => {
      await deletePost.execute({ id: '8295fd9c-616e-4f6d-b814-360396cf7342', userRole: 'admin' });
    }).rejects.toThrow("Post não encontrado");
  });

  test("retorna 'Post deletado com sucesso' com um ID válido", async () => {
    const createPost = new CreatePost(repositoryFactory);
    const newPostResponse = await createPost.execute(baseInput);
    const response = await deletePost.execute({ id: newPostResponse.post.id, userRole: 'admin' });
    expect(response.message).toBe("Post deletado com sucesso");
  });
});
