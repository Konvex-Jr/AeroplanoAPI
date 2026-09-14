import UserRepositoryInterface from "./UserRepositoryInterface";
import PostRepositoryInterface from "./PostRepositoryInterface";
import PartnerPostRepositoryInterface from "./PartnerPostRepositoryInterface";

export default interface RepositoryFactoryInterface {

    createUserRepository(): UserRepositoryInterface;
    createPostRepository(): PostRepositoryInterface;
    createPartnerPostRepository(): PartnerPostRepositoryInterface;

}