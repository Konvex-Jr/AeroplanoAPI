import AppError from "../../../domain/AppError";
import PartnerPost from "../../../domain/Entity/PartnerPost";
import PartnerPostRepositoryInterface from "../../../domain/Interfaces/PartnerPostRepositoryInterface";
import Connection from "../../database/Connection";

export default class PartnerPostRepositoryDatabase implements PartnerPostRepositoryInterface {

    constructor(protected connection: Connection) {}

    async save(post: PartnerPost): Promise<PartnerPost | null> {
        await this.connection.execute(
            "INSERT INTO partner_posts (id, user_id, title, description, image, file_size, original_filename, created_at, updated_at, deleted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
            [post.id, post.user_id, post.title, post.description, post.image, post.file_size, post.original_filename, post.created_at, post.updated_at, post.deleted_at]
        );
        if (post.content) {
            await this.connection.execute(
                "INSERT INTO partner_post_contents (post_id, content) VALUES ($1, $2);",
                [post.id, post.content]
            );
        }
        return await this.findById(post.id);
    }

    async findById(id: string): Promise<PartnerPost | null> {
        const result = await this.connection.execute(
            `SELECT pp.id, pp.user_id, pp.title, pp.description, pp.image, pp.file_size, pp.original_filename,
                    pp.created_at, pp.updated_at, pp.deleted_at,
                    COALESCE(u.username, '') AS username
             FROM partner_posts pp
             LEFT JOIN users u ON u.id = pp.user_id
             WHERE pp.id = $1 AND pp.deleted_at IS NULL;`,
            [id]
        );
        const p = result?.[0];
        return p ? new PartnerPost(p.user_id, p.title, p.description, p.image, p.file_size, p.original_filename, p.created_at, p.updated_at, null, p.id, p.username) : null;
    }

    async findContentById(id: string): Promise<Buffer | null> {
        const result = await this.connection.execute(
            "SELECT content FROM partner_post_contents WHERE post_id = $1;",
            [id]
        );
        return result[0]?.content ?? null;
    }

    async findByUserId(userId: string): Promise<PartnerPost[]> {
        const result = await this.connection.execute(
            `SELECT pp.id, pp.user_id, pp.title, pp.description, pp.image, pp.file_size, pp.original_filename,
                    pp.created_at, pp.updated_at,
                    COALESCE(u.username, '') AS username
             FROM partner_posts pp
             LEFT JOIN users u ON u.id = pp.user_id
             WHERE pp.user_id = $1 AND pp.deleted_at IS NULL
             ORDER BY pp.created_at DESC;`,
            [userId]
        );
        return result.map((p: any) =>
            new PartnerPost(p.user_id, p.title, p.description, p.image, p.file_size, p.original_filename, p.created_at, p.updated_at, null, p.id, p.username)
        );
    }

    async getAll(): Promise<PartnerPost[]> {
        const result = await this.connection.execute(
            `SELECT pp.id, pp.user_id, pp.title, pp.description, pp.image, pp.file_size, pp.original_filename,
                    pp.created_at, pp.updated_at,
                    COALESCE(u.username, '') AS username
             FROM partner_posts pp
             LEFT JOIN users u ON u.id = pp.user_id
             WHERE pp.deleted_at IS NULL
             ORDER BY pp.created_at DESC;`
        );
        return result.map((p: any) =>
            new PartnerPost(p.user_id, p.title, p.description, p.image, p.file_size, p.original_filename, p.created_at, p.updated_at, null, p.id, p.username)
        );
    }

    async update(id: string, userId: string, title: string, description: string, image: string): Promise<PartnerPost> {
        const existing = await this.findById(id);
        if (!existing) throw new AppError("Post não encontrado");
        if (existing.user_id !== userId) throw new AppError("Sem permissão para editar este post");
        await this.connection.execute(
            "UPDATE partner_posts SET title = $1, description = $2, image = $3, updated_at = $4 WHERE id = $5;",
            [title, description, image, new Date(), id]
        );
        return (await this.findById(id))!;
    }

    async delete(id: string, userId: string): Promise<string> {
        const existing = await this.findById(id);
        if (!existing) throw new AppError("Post não encontrado");
        if (existing.user_id !== userId) throw new AppError("Sem permissão para excluir este post");
        await this.connection.execute("UPDATE partner_posts SET deleted_at = $1 WHERE id = $2;", [new Date(), id]);
        return "Post deletado com sucesso";
    }
}
