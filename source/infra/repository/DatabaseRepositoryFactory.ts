import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";

import Connection from "../database/Connection";

import UserRepositoryDatabase from "./database/UserRepositoryDatabase";
import PostRepositoryDatabase from "./database/PostRepositoryDatabase";

export default class DatabaseRepositoryFactory implements RepositoryFactoryInterface {

    readonly userRepository: UserRepositoryInterface;
    readonly postRepository: PostRepositoryInterface;

    constructor(connection: Connection) {
        this.userRepository = new UserRepositoryDatabase(connection);
        this.postRepository = new PostRepositoryDatabase(connection);
    }

    createUserRepository(): UserRepositoryInterface { return this.userRepository; }
    createPostRepository(): PostRepositoryInterface { return this.postRepository; }
}