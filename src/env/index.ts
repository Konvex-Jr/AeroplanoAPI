import "dotenv/config";
import z from "zod";

const envBodySchema = z.object({
    
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_DATABASE: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    
    PORT: z.coerce.number(),

    JWT_PRIVATE_KEY: z.string(),
    JWT_PUBLIC_KEY: z.string(),

    CORS_ORIGIN: z.string()
})

const _env = envBodySchema.safeParse(process.env)

if(_env.success === false) throw new Error(`ERRO: Falha ao carregar Variáveis de Ambiente... \n ${_env.error}`)

const env = _env.data

export { env }