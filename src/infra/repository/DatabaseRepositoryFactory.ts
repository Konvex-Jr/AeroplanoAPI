import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";

import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface.js";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface.js";

import Connection from "../database/Connection.js";

import UserRepositoryDatabase from "./database/UserRepositoryDatabase.js";
import PostRepositoryDatabase from "./database/PostRepositoryDatabase.js";

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