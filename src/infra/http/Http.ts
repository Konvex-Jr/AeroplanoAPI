import HttpMethods from "./HttpMethods.js";

export default interface Http {

    route (method: HttpMethods, url: string, auth: boolean, callback: any, middleware?: any): Promise<any>;
    listen (port: number): Promise<void>;

}