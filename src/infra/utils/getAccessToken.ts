import { AccessTokenSchema } from "@/infra/http/schemas.js";
import { Request } from "express"

export function getAccessToken(req: Request){

    const parsedData = AccessTokenSchema.safeParse(req.headers.authorization)

    if(parsedData.success == false) return null

    const access_token = parsedData.data

    return access_token

}