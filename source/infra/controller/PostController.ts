import { validateAndSanitizeImage } from "../utils/imageSanitizer";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import CreatePost from "../../useCases/createPost/CreatePost";
import FindPostById from "../../useCases/findPostById/FindPostById";
import FindPostByDate from "../../useCases/findPostByDate/FindPostByDate";
import GetAllPosts from "../../useCases/getAllPosts/GetAllPosts";
import UpdatePost from "../../useCases/updatePost/UpdatePost";
import DeletePost from "../../useCases/deletePost/DeletePost";

export default class PostController {

    constructor(protected repositoryFactory: RepositoryFactoryInterface) {}

    async create(input: { title: string, description: string, image: string }) {
        const image = await validateAndSanitizeImage(input.image);

        const createPost = new CreatePost(this.repositoryFactory);
        return await createPost.execute({
            title: input.title,
            description: input.description,
            image
        });
    }

    async getAll() {
        const getAllPosts = new GetAllPosts(this.repositoryFactory);
        return await getAllPosts.execute();
    }

    async findById(input: any) {
        const findById = new FindPostById(this.repositoryFactory);
        return await findById.execute(input);
    }

    async findByDate(input: any) {
        const findByDate = new FindPostByDate(this.repositoryFactory);
        return await findByDate.execute(input);
    }

    async update(params: any, input: { title: string, description: string, image?: string }) {
        // Capa é opcional na edição: sem imagem nova, mantém a atual.
        const image = input.image ? await validateAndSanitizeImage(input.image) : undefined;

        const updatePost = new UpdatePost(this.repositoryFactory);
        return await updatePost.execute(params, {
            title: input.title,
            description: input.description,
            image
        });
    }

    async delete(params: any, user: any) {
        const deletePost = new DeletePost(this.repositoryFactory);
        return await deletePost.execute({ id: params.id, userRole: user?.role ?? '' });
    }
}
