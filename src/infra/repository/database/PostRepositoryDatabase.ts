import Post from "../../../domain/Entity/Post.js";
import PostRepositoryInterface from "../../../domain/Interfaces/PostRepositoryInterface.js";
import Connection from "../../database/Connection.js";

export default class PostRepositoryDatabase implements PostRepositoryInterface {

    constructor(protected connection: Connection) {}

    async save(post: Post): Promise<Post | null> {
        
        await this.connection.execute(
            "INSERT INTO posts (id, title, image, content, file_size, file_type, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
            [ post.id, post.title, post.image, post.content, post.file_size, post.file_type, post.created_at, post.updated_at, post.user_id]
        );
        
        return await this.findById(post.id);
    }

    async findById(id: string): Promise<Post | null> {
        const result = await this.connection.execute(
            "SELECT id, title, image, content, file_size, file_type, created_at, updated_at, user_id FROM posts WHERE id = $1;",
            [ id ]
        );

        const p: Post = result[0];
        
        return p ? new Post(p.title, p.image, p.content, p.file_size, p.file_type, p.created_at, p.updated_at, p.user_id) : null;
    }

    async getAll(): Promise<Post[]> {
        const result = await this.connection.execute(
            `SELECT id, title, image, content, file_size, file_type, created_at, updated_at, user_id
             FROM posts ORDER BY created_at DESC;`
        );

        return result.map((p: Post) =>
            new Post(p.id, p.image, p.content, p.file_size, p.file_type, p.created_at, p.updated_at, p.user_id)
        );
    }

    async update(id: string, title: string, image: Buffer, content: string): Promise<Post> {
        
        await this.connection.execute(
            "UPDATE posts SET title = $1, description = $2, image = $3, updated_at = $4 WHERE id = $5;",
            [ title, content, image, new Date(), id ]
        );
        
        return (await this.findById(id))!;
    }

    async delete(id: string): Promise<string> {
        
        await this.connection.execute("DELETE FROM posts WHERE id = $1;", [ id ]);
        
        return "Post deletado com sucesso";
    }
}
