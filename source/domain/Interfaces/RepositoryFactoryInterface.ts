import UserRepositoryInterface from "./UserRepositoryInterface";
import PostRepositoryInterface from "./PostRepositoryInterface";

export default interface RepositoryFactoryInterface {

    createUserRepository(): UserRepositoryInterface;
    createPostRepository(): PostRepositoryInterface;

}