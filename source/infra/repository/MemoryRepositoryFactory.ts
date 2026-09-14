import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import UserRepositoryMemory from "./memory/UserRepositoryMemory";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";
import PostRepositoryMemory from "./memory/PostRepositoryMemory";
import PartnerPostRepositoryInterface from "../../domain/Interfaces/PartnerPostRepositoryInterface";
import PartnerPostRepositoryMemory from "./memory/PartnerPostRepositoryMemory";

import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";

export default class MemoryRepositoryFactory implements RepositoryFactoryInterface {

    readonly userRepository: UserRepositoryInterface;
    readonly postRepository: PostRepositoryInterface;
    readonly partnerPostRepository: PartnerPostRepositoryInterface;

    constructor() {
        this.userRepository = new UserRepositoryMemory();
        this.postRepository = new PostRepositoryMemory();
        this.partnerPostRepository = new PartnerPostRepositoryMemory();
    }

    createPostRepository(): PostRepositoryInterface {
        return this.postRepository;
    }

    createUserRepository(): UserRepositoryInterface {
        return this.userRepository;
    }

    createPartnerPostRepository(): PartnerPostRepositoryInterface {
        return this.partnerPostRepository;
    }
}