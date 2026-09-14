import AppError from "../../domain/AppError";
import crypto from "crypto";
import { validateAndSanitizePdf } from "../utils/pdfSanitizer";
import { validateAndSanitizeImage } from "../utils/imageSanitizer";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import CreatePost from "../../useCases/createPost/CreatePost";
import FindPostById from "../../useCases/findPostById/FindPostById";
import FindPostByDate from "../../useCases/findPostByDate/FindPostByDate";
import GetAllPosts from "../../useCases/getAllPosts/GetAllPosts";
import UpdatePost from "../../useCases/updatePost/UpdatePost";
import DeletePost from "../../useCases/deletePost/DeletePost";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";


export default class PostController {

    protected postRepository: PostRepositoryInterface;

    constructor(protected repositoryFactory: RepositoryFactoryInterface) {
        this.postRepository = repositoryFactory.createPostRepository();
    }

    async create(body: any, file?: Express.Multer.File, user?: any) {
        const { title, description, image } = body;

        if (!title || title.length < 1 || title.length > 255) throw new AppError("Título deve ter entre 1 e 255 caracteres");
        if (!description || description.length < 1 || description.length > 10000) throw new AppError("Descrição deve ter entre 1 e 10000 caracteres");
        if (!file) throw new AppError("Arquivo PDF é obrigatório");

        const sanitizedImage = await validateAndSanitizeImage(image ?? "");
        const sanitizedPdf = await validateAndSanitizePdf(file.buffer);

        const createPost = new CreatePost(this.repositoryFactory);
        const result = await createPost.execute({
            title,
            description,
            image: sanitizedImage,
            content: sanitizedPdf,
            file_size: file.size,
            original_filename: file.originalname,
            username: user?.username ?? ""
        });

        const { content: _omit, ...metadata } = result.post as any;
        return { post: metadata };
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

    async update(params: any, input: any) {
        const updatePost = new UpdatePost(this.repositoryFactory);
        return await updatePost.execute(params, input);
    }

    async delete(params: any, user: any) {
        const deletePost = new DeletePost(this.repositoryFactory);
        return await deletePost.execute({ id: params.id, userRole: user?.role ?? '' });
    }

    async streamPdf(id: string, req: any, res: any): Promise<null> {
        const REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!REGEX.test(id)) { res.status(400).json({ message: "ID inválido" }); return null; }

        const post = await this.postRepository.findById(id);
        if (!post) { res.status(404).json({ message: "Post não encontrado" }); return null; }

        const content = await this.postRepository.findContentById(id);
        if (!content) { res.status(404).json({ message: "Conteúdo não encontrado" }); return null; }

        const etag = `"${post.file_size}-${crypto.createHash("sha1").update(content).digest("hex").slice(0, 16)}"`;

        if (req.headers["if-none-match"] === etag) {
            res.status(304).end();
            return null;
        }

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${post.original_filename}"`,
            "Content-Length": content.length,
            "Cache-Control": "private, max-age=3600",
            "X-Content-Type-Options": "nosniff",
            "ETag": etag
        });

        res.end(content);
        return null;
    }
}
