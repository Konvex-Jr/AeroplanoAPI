import { NULL } from "@/infra/http/schemas.js"
import { randomUUID } from "node:crypto"

export default class Post {

    readonly id: string

    readonly title: string
    readonly image: Buffer | NULL
    readonly content: string
    readonly file_size: number
    readonly file_type: string

    readonly created_at: Date
    readonly updated_at: Date

    readonly user_id: string

    constructor (
        title: string,
        image: Buffer | NULL,
        content: string,
        file_size: number,
        file_type: string,
        created_at: Date,
        updated_at: Date,
        user_id: string,
        id?: string) {

            if (!id) id = randomUUID()
            if(!image) image = null

            this.id = id
            this.title = title
            this.image = image
            this.content = content
            this.file_size = file_size
            this.file_type = file_type
            this.created_at = created_at
            this.updated_at = updated_at
            this.user_id = user_id
            
        }
}
