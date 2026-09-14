import AppError from "../../../domain/AppError";
import PartnerPost from "../../../domain/Entity/PartnerPost";
import PartnerPostRepositoryInterface from "../../../domain/Interfaces/PartnerPostRepositoryInterface";

export default class PartnerPostRepositoryMemory implements PartnerPostRepositoryInterface {

    private posts: PartnerPost[] = [];

    async save(post: PartnerPost): Promise<PartnerPost> {
        this.posts.push(post);
        return post;
    }

    async findById(id: string): Promise<PartnerPost | null> {
        return this.posts.find(p => p.id === id && !p.deleted_at) ?? null;
    }

    async findContentById(id: string): Promise<Buffer | null> {
        const post = this.posts.find(p => p.id === id);
        return post?.content ?? null;
    }

    async findByUserId(userId: string): Promise<PartnerPost[]> {
        return this.posts.filter(p => p.user_id === userId && !p.deleted_at);
    }

    async getAll(): Promise<PartnerPost[]> {
        return this.posts.filter(p => !p.deleted_at);
    }

    async update(id: string, userId: string, title: string, description: string, image: string): Promise<PartnerPost> {
        const index = this.posts.findIndex(p => p.id === id);
        if (index === -1) throw new AppError("Post não encontrado");
        const old = this.posts[index];
        if (old.user_id !== userId) throw new AppError("Sem permissão para editar este post");
        const updated = new PartnerPost(old.user_id, title, description, image, old.file_size, old.original_filename, old.created_at, new Date(), old.deleted_at, old.id, old.username, old.content);
        this.posts[index] = updated;
        return updated;
    }

    async delete(id: string, userId: string): Promise<string> {
        const index = this.posts.findIndex(p => p.id === id);
        if (index === -1) throw new AppError("Post não encontrado");
        const old = this.posts[index];
        if (old.user_id !== userId) throw new AppError("Sem permissão para excluir este post");
        this.posts[index] = new PartnerPost(old.user_id, old.title, old.description, old.image, old.file_size, old.original_filename, old.created_at, old.updated_at, new Date(), old.id, old.username, old.content);
        return "Post deletado com sucesso";
    }
}
