import Post from "../Entity/Post";

export default interface PostRepositoryInterface {
    save(post: Post): Promise<Post | null>;
    getAll(): Promise<Post[]>;
    findById(id: string): Promise<Post | null>;
    findByDate(search: Date): Promise<Post[] | null>;
    update(id: string, title: string, description: string, image: string): Promise<Post>;
    delete(id: string): Promise<string | null>;
}
