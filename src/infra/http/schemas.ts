import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const plain = (val: string) => sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });

const sanitizedText = (min: number, max: number, minMsg: string, maxMsg: string) =>
    z.string().min(min, minMsg).max(max, maxMsg).transform(plain);

export const RegisterSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(12, "A senha deve ter no mínimo 12 caracteres"),
    username: sanitizedText(1, 50, "Username é obrigatório", "Username muito longo").optional(),
});

export const LoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export const UpdateUsernameSchema = z.object({
    username: sanitizedText(1, 50, "Username não pode ser vazio", "Username muito longo"),
});

export const CreatePostSchema = z.object({
    title: sanitizedText(1, 255, "Título é obrigatório", "Título muito longo"),
    description: sanitizedText(1, 10000, "Descrição é obrigatória", "Descrição muito longa"),
    image: z.string().optional(),
});

export const UpdatePostSchema = z.object({
    title: sanitizedText(1, 255, "Título é obrigatório", "Título muito longo"),
    description: sanitizedText(1, 10000, "Descrição é obrigatória", "Descrição muito longa"),
    image: z.string().optional(),
});
