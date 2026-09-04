import { randomUUID } from "node:crypto";
export default class User {

    readonly id: string;
    readonly email: string;
    readonly password: string;

    constructor (
        email: string, 
        password: string, 
        id?: string) {

        if (!id) id = randomUUID();
        
        this.id = id;
        this.email = email;
        this.password = password;

    }
}