import { v4 as uuid } from "uuid";

// Um post do blog tem apenas: título, descrição e imagem de capa.
export default class Post {

    readonly id: string
    readonly title: string
    readonly description: string
    readonly image: string

    constructor(
        title: string,
        description: string,
        image: string,
        id?: string,
    ) {

        if (!id) id = uuid()
        this.id = id
        this.title = title
        this.description = description
        this.image = image
    }
}
