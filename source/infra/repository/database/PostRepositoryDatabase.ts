import Post from "../../../domain/Entity/Post";
import PostRepositoryInterface from "../../../domain/Interfaces/PostRepositoryInterface";
import Connection from "../../database/Connection";

// created_at / updated_at / deleted_at existem só na tabela (ordenação, busca por
// data e exclusão lógica). Não fazem parte da entidade nem da resposta da API.
const COLUMNS = "id, title, description, image";

export default class PostRepositoryDatabase implements PostRepositoryInterface {

    constructor(protected connection: Connection) {}

    private toPost(row: any): Post {
        return new Post(row.title, row.description, row.image ?? "", row.id);
    }

    async save(post: Post): Promise<Post | null> {
        const now = new Date();
        await this.connection.execute(
            "INSERT INTO posts (id, title, description, image, created_at, updated_at, deleted_at) VALUES ($1, $2, $3, $4, $5, $5, NULL);",
            [post.id, post.title, post.description, post.image, now]
        );
        return await this.findById(post.id);
    }

    async findById(id: string): Promise<Post | null> {
        const result = await this.connection.execute(
            `SELECT ${COLUMNS} FROM posts WHERE id = $1 AND deleted_at IS NULL;`,
            [id]
        );
        return result[0] ? this.toPost(result[0]) : null;
    }

    async findByDate(search: Date): Promise<Post[] | null> {
        const pad = (n: number) => String(n).padStart(2, "0");
        const day = `${search.getFullYear()}-${pad(search.getMonth() + 1)}-${pad(search.getDate())}`;
        const result = await this.connection.execute(
            `SELECT ${COLUMNS} FROM posts
             WHERE created_at >= $1::date AND created_at < ($1::date + 1) AND deleted_at IS NULL
             ORDER BY created_at DESC;`,
            [day]
        );
        return result ? result.map((row: any) => this.toPost(row)) : null;
    }

    async getAll(): Promise<Post[]> {
        const result = await this.connection.execute(
            `SELECT ${COLUMNS} FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC;`
        );
        return result.map((row: any) => this.toPost(row));
    }

    async update(id: string, title: string, description: string, image: string): Promise<Post> {
        await this.connection.execute(
            "UPDATE posts SET title = $1, description = $2, image = $3, updated_at = $4 WHERE id = $5 AND deleted_at IS NULL;",
            [title, description, image, new Date(), id]
        );
        return (await this.findById(id))!;
    }

    async delete(id: string): Promise<string> {
        await this.connection.execute("UPDATE posts SET deleted_at = $1 WHERE id = $2;", [new Date(), id]);
        return "Post deletado com sucesso";
    }
}
