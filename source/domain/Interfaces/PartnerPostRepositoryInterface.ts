import PartnerPost from "../Entity/PartnerPost";

export default interface PartnerPostRepositoryInterface {
    save(post: PartnerPost): Promise<PartnerPost | null>;
    getAll(): Promise<PartnerPost[]>;
    findById(id: string): Promise<PartnerPost | null>;
    findContentById(id: string): Promise<Buffer | null>;
    findByUserId(userId: string): Promise<PartnerPost[]>;
    update(id: string, userId: string, title: string, description: string, image: string): Promise<PartnerPost>;
    delete(id: string, userId: string): Promise<string>;
}
