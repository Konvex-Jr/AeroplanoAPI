import Post from "../../../domain/Entity/Post";
import PostRepositoryInterface from "../../../domain/Interfaces/PostRepositoryInterface";
import Connection from "../../database/Connection";

export default class PostRepositoryDatabase implements PostRepositoryInterface {

    constructor(protected connection: Connection) {}

    async save(post: Post): Promise<Post | null> {
        await this.connection.execute(
            "INSERT INTO posts (id, title, description, image, file_size, original_filename, username, created_at, updated_at, deleted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
            [post.id, post.title, post.description, post.image, post.file_size, post.original_filename, post.username, post.created_at, post.updated_at, post.deleted_at]
        );
        if (post.content) {
            await this.connection.execute(
                "INSERT INTO post_contents (post_id, content) VALUES ($1, $2);",
                [post.id, post.content]
            );
        }
        return await this.findById(post.id);
    }

    async findById(id: string): Promise<Post | null> {
        const result = await this.connection.execute(
            "SELECT id, title, description, image, file_size, original_filename, username, created_at, updated_at, deleted_at FROM posts WHERE id = $1 AND deleted_at IS NULL;",
            [id]
        );
        const p = result[0];
        return p ? new Post(p.title, p.description, p.image, p.file_size, p.original_filename, p.created_at, p.updated_at, p.deleted_at, p.id, p.username) : null;
    }

    async findContentById(id: string): Promise<Buffer | null> {
        const result = await this.connection.execute(
            "SELECT content FROM post_contents WHERE post_id = $1;",
            [id]
        );
        return result[0]?.content ?? null;
    }

    async findByDate(search: Date): Promise<Post[] | null> {
        const startOfDay = `${search.getFullYear()}-${search.getMonth() + 1}-${search.getDate()} 00:00:00`;
        const endOfDay = `${search.getFullYear()}-${search.getMonth() + 1}-${search.getDate()} 23:59:59`;
        const result = await this.connection.execute(
            `SELECT id, title, description, image, file_size, original_filename, username, created_at, updated_at
             FROM posts WHERE created_at >= $1 AND created_at <= $2 AND deleted_at IS NULL;`,
            [startOfDay, endOfDay]
        );
        return result ? result.map((p: any) =>
            new Post(p.title, p.description, p.image, p.file_size, p.original_filename, p.created_at, p.updated_at, null, p.id, p.username)
        ) : null;
    }

    async getAll(): Promise<Post[]> {
        const result = await this.connection.execute(
            `SELECT id, title, description, image, file_size, original_filename, username, created_at, updated_at, deleted_at
             FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC;`
        );
        return result.map((p: any) =>
            new Post(p.title, p.description, p.image, p.file_size, p.original_filename, p.created_at, p.updated_at, p.deleted_at, p.id, p.username)
        );
    }

    async update(id: string, title: string, description: string, image: string): Promise<Post> {
        await this.connection.execute(
            "UPDATE posts SET title = $1, description = $2, image = $3, updated_at = $4 WHERE id = $5;",
            [title, description, image, new Date(), id]
        );
        return (await this.findById(id))!;
    }

    async delete(id: string): Promise<string> {
        await this.connection.execute("UPDATE posts SET deleted_at = $1 WHERE id = $2;", [new Date(), id]);
        return "Post deletado com sucesso";
    }
}
