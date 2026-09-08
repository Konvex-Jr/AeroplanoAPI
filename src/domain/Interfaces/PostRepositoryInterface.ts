import { UNDEFINED } from "@/infra/http/schemas.js";
import Post from "../Entity/Post.js";

export default interface PostRepositoryInterface {
    
    save(post: Post): Promise<Post | null>;
    update(id: string, title: string | UNDEFINED, image: Buffer | UNDEFINED, content: string | UNDEFINED): Promise<Post>;
    delete(id: string): Promise<string | null>;
    
    getAll(): Promise<Post[]>;
    findById(id: string): Promise<Post | null>;    
}
