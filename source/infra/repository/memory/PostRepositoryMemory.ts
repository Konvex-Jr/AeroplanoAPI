import AppError from "../../../domain/AppError";
import Post from "../../../domain/Entity/Post";
import PostRepositoryInterface from "../../../domain/Interfaces/PostRepositoryInterface";

export default class PostRepositoryMemory implements PostRepositoryInterface {

    private posts: Post[] = [];

    async save(post: Post): Promise<Post> {
        this.posts.push(post);
        return post;
    }

    async findById(id: string): Promise<Post | null> {
        return this.posts.find(p => p.id === id && !p.deleted_at) ?? null;
    }

    async findContentById(id: string): Promise<Buffer | null> {
        const post = this.posts.find(p => p.id === id);
        return post?.content ?? null;
    }

    async findByDate(search: Date): Promise<Post[] | null> {
        const date_search = `${search.getFullYear()}-${(search.getMonth() + 1).toString().padStart(2, '0')}-${search.getDate()}`;
        return this.posts.filter(p => {
            const created_str = `${p.created_at.getFullYear()}-${(p.created_at.getMonth() + 1).toString().padStart(2, '0')}-${p.created_at.getDate()}`;
            return date_search === created_str && !p.deleted_at;
        });
    }

    async getAll(): Promise<Post[]> {
        return this.posts.filter(p => !p.deleted_at);
    }

    async update(id: string, title: string, description: string, image: string): Promise<Post> {
        const index = this.posts.findIndex(p => p.id === id);
        if (index === -1) throw new AppError("Post não encontrado");
        const old = this.posts[index];
        this.posts[index] = new Post(title, description, image, old.file_size, old.original_filename, old.created_at, new Date(), old.deleted_at, old.id, old.username, old.content);
        return this.posts[index];
    }

    async delete(id: string): Promise<string | null> {
        const index = this.posts.findIndex(p => p.id === id);
        if (index === -1) return null;
        const old = this.posts[index];
        this.posts[index] = new Post(old.title, old.description, old.image, old.file_size, old.original_filename, old.created_at, old.updated_at, new Date(), old.id, old.username, old.content);
        return "Post deletado com sucesso";
    }
}
