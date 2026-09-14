import { v4 as uuid } from "uuid";

export type UserRole = 'admin' | 'partner';

export default class User {

    readonly id: string;
    readonly email: string;
    readonly password: string;
    readonly role: UserRole;
    readonly username: string;

    constructor(email: string, password: string, id?: string, role: UserRole = 'partner', username: string = '') {

        if (!id) id = uuid();
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.username = username;

    }
}