import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import UserRepositoryMemory from "./memory/UserRepositoryMemory";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";
import PostRepositoryMemory from "./memory/PostRepositoryMemory";

import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";

export default class MemoryRepositoryFactory implements RepositoryFactoryInterface {

    readonly userRepository: UserRepositoryInterface;
    readonly postRepository: PostRepositoryInterface;

    constructor() {
        this.userRepository = new UserRepositoryMemory();
        this.postRepository = new PostRepositoryMemory();
    }

    createPostRepository(): PostRepositoryInterface {
        return this.postRepository;
    }

    createUserRepository(): UserRepositoryInterface {
        return this.userRepository;
    }

}