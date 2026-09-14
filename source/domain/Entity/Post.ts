import { v4 as uuid } from "uuid";

export default class Post {

    readonly id: string
    readonly title: string
    readonly description: string
    readonly image: string
    readonly content?: Buffer
    readonly file_size: number
    readonly original_filename: string
    readonly created_at: Date
    readonly updated_at: Date
    readonly deleted_at: Date | null
    readonly username: string

    constructor(
        title: string,
        description: string,
        image: string,
        file_size: number,
        original_filename: string,
        created_at: Date,
        updated_at: Date,
        deleted_at: Date | null,
        id?: string,
        username: string = '',
        content?: Buffer) {

        if (!id) id = uuid()
        this.id = id
        this.title = title
        this.description = description
        this.image = image
        this.file_size = file_size
        this.original_filename = original_filename
        this.created_at = created_at
        this.updated_at = updated_at
        this.deleted_at = deleted_at
        this.username = username
        this.content = content
    }
}
