import Post from "../../domain/Entity/Post.js";

export default interface GetAllPostsOutput {
    data: Post[];
}