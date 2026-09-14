import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import UserRepositoryInterface from "../../domain/Interfaces/UserRepositoryInterface";
import PostRepositoryInterface from "../../domain/Interfaces/PostRepositoryInterface";
import PartnerPostRepositoryInterface from "../../domain/Interfaces/PartnerPostRepositoryInterface";

import Connection from "../database/Connection";

import UserRepositoryDatabase from "./database/UserRepositoryDatabase";
import PostRepositoryDatabase from "./database/PostRepositoryDatabase";
import PartnerPostRepositoryDatabase from "./database/PartnerPostRepositoryDatabase";

export default class DatabaseRepositoryFactory implements RepositoryFactoryInterface {

    readonly userRepository: UserRepositoryInterface;
    readonly postRepository: PostRepositoryInterface;
    readonly partnerPostRepository: PartnerPostRepositoryInterface;

    constructor(connection: Connection) {
        this.userRepository = new UserRepositoryDatabase(connection);
        this.postRepository = new PostRepositoryDatabase(connection);
        this.partnerPostRepository = new PartnerPostRepositoryDatabase(connection);
    }

    createUserRepository(): UserRepositoryInterface { return this.userRepository; }
    createPostRepository(): PostRepositoryInterface { return this.postRepository; }
    createPartnerPostRepository(): PartnerPostRepositoryInterface { return this.partnerPostRepository; }
}