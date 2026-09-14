export default interface CreatePostInput {
    title: string
    description: string
    image: string
    content: Buffer
    file_size: number
    original_filename: string
    username?: string
}
