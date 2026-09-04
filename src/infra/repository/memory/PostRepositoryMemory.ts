import AppError from "../../../domain/AppError.js";
import Post from "../../../domain/Entity/Post.js";
import User from "../../../domain/Entity/User.js";
import PostRepositoryInterface from "../../../domain/Interfaces/PostRepositoryInterface.js";

export default class PostRepositoryMemory implements PostRepositoryInterface {

    private posts: Post[] = [];

    async save(post: Post): Promise<Post> {
        this.posts.push(post);
        return post;
    }

    async update(id: string, title: string, image: Buffer, content: string): Promise<Post> {
        const index = this.posts.findIndex(p => p.id === id);
        if (index === -1) throw new AppError("Post não encontrado.");
        const old = this.posts[index];
        this.posts[index] = new Post(title, image, content, old.file_size, old.file_type, old.created_at, new Date(), old.user_id, old.id);
        return this.posts[index];
    }

    async delete(post_id: string): Promise<string | null> {
        this.posts = this.posts.filter((post: Post) => { post.id !== post_id });
        return "Post deletado com sucesso."
    }

    async findById(id: string): Promise<Post | null> {
        const post = this.posts.find(p => p.id === id) ?? null;
        return post ?? null
    }

    async getAll(): Promise<Post[]> {
        return this.posts;
    }
}
