import UserRepositoryInterface from "./UserRepositoryInterface.js";
import PostRepositoryInterface from "./PostRepositoryInterface.js";

export default interface RepositoryFactoryInterface {

    createUserRepository(): UserRepositoryInterface;
    createPostRepository(): PostRepositoryInterface;

}