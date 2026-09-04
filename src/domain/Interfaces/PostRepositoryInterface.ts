import Post from "../Entity/Post.js";

export default interface PostRepositoryInterface {
    
    save(post: Post): Promise<Post | null>;
    update(id: string, title: string, image: Buffer, content: string): Promise<Post>;
    delete(id: string): Promise<string | null>;
    
    getAll(): Promise<Post[]>;
    findById(id: string): Promise<Post | null>;    
}
