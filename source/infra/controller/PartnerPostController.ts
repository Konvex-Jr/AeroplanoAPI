import AppError from "../../domain/AppError";
import crypto from "crypto";
import { validateAndSanitizePdf } from "../utils/pdfSanitizer";
import { validateAndSanitizeImage } from "../utils/imageSanitizer";
import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import PartnerPost from "../../domain/Entity/PartnerPost";
import PartnerPostRepositoryInterface from "../../domain/Interfaces/PartnerPostRepositoryInterface";


export default class PartnerPostController {

    protected partnerPostRepository: PartnerPostRepositoryInterface;

    constructor(repositoryFactory: RepositoryFactoryInterface) {
        this.partnerPostRepository = repositoryFactory.createPartnerPostRepository();
    }

    async create(userId: string, body: any, file?: Express.Multer.File): Promise<any> {
        const { title, description, image } = body;

        if (!title || title.length < 1 || title.length > 255) throw new AppError("Título deve ter entre 1 e 255 caracteres");
        if (!description || description.length < 1 || description.length > 10000) throw new AppError("Descrição deve ter entre 1 e 10000 caracteres");
        if (!file) throw new AppError("Arquivo PDF é obrigatório");

        const sanitizedImage = await validateAndSanitizeImage(image ?? "");
        const sanitizedPdf = await validateAndSanitizePdf(file.buffer);

        const post = new PartnerPost(
            userId, title, description, sanitizedImage,
            sanitizedPdf.length, file.originalname,
            new Date(), new Date(), null,
            undefined, '', sanitizedPdf
        );

        const saved = await this.partnerPostRepository.save(post);
        const { content: _omit, ...metadata } = saved as any;
        return metadata;
    }

    async getAll(): Promise<any> {
        const posts = await this.partnerPostRepository.getAll();
        return { data: posts };
    }

    async update(userId: string, params: any, body: any): Promise<any> {
        const { id } = params;
        const { title, description, image } = body;
        return await this.partnerPostRepository.update(id, userId, title, description, image ?? "");
    }

    async delete(userId: string, params: any): Promise<any> {
        const { id } = params;
        return await this.partnerPostRepository.delete(id, userId);
    }

    async streamPdf(id: string, req: any, res: any): Promise<null> {
        const REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!REGEX.test(id)) { res.status(400).json({ message: "ID inválido" }); return null; }

        const post = await this.partnerPostRepository.findById(id);
        if (!post) { res.status(404).json({ message: "Post não encontrado" }); return null; }

        const content = await this.partnerPostRepository.findContentById(id);
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
