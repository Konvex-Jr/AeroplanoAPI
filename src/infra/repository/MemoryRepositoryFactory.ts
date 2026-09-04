import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface.js";
import UserRepositoryMemory from "./memory/UserRepositoryMemory.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";
import PostRepositoryMemory from "./memory/PostRepositoryMemory.js";

import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";

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