import AppError from "../../../domain/AppError";
import Post from "../../../domain/Entity/Post";
import PostRepositoryInterface from "../../../domain/Interfaces/PostRepositoryInterface";

// Mesma ideia do repositório de banco: datas ficam só na "tabela", fora da entidade.
interface PostRecord {
    post: Post;
    created_at: Date;
    deleted_at: Date | null;
}

const dayKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default class PostRepositoryMemory implements PostRepositoryInterface {

    private records: PostRecord[] = [];

    private alive(): PostRecord[] {
        return this.records.filter(r => !r.deleted_at);
    }

    async save(post: Post): Promise<Post> {
        this.records.push({ post, created_at: new Date(), deleted_at: null });
        return post;
    }

    async findById(id: string): Promise<Post | null> {
        return this.alive().find(r => r.post.id === id)?.post ?? null;
    }

    async findByDate(search: Date): Promise<Post[] | null> {
        const wanted = dayKey(search);
        return this.alive().filter(r => dayKey(r.created_at) === wanted).map(r => r.post).reverse();
    }

    async getAll(): Promise<Post[]> {
        // Mais novos primeiro, igual ao ORDER BY created_at DESC do banco.
        return this.alive().map(r => r.post).reverse();
    }

    async update(id: string, title: string, description: string, image: string): Promise<Post> {
        const record = this.alive().find(r => r.post.id === id);
        if (!record) throw new AppError("Post não encontrado");
        record.post = new Post(title, description, image, id);
        return record.post;
    }

    async delete(id: string): Promise<string | null> {
        const record = this.alive().find(r => r.post.id === id);
        if (!record) return null;
        record.deleted_at = new Date();
        return "Post deletado com sucesso";
    }
}
