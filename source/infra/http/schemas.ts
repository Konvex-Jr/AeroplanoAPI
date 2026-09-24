import { z } from "zod";
import sanitizeHtml from "sanitize-html";

// Remove qualquer HTML. O sanitize-html devolve o texto com entidades escapadas
// (ex: "P&D" vira "P&amp;D"), então desfazemos isso para o texto ficar como o
// usuário digitou. Como o front renderiza como texto (nunca como HTML), é seguro.
const plain = (val: string) =>
    sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");

const sanitizedText = (min: number, max: number, minMsg: string, maxMsg: string) =>
    z.string().trim().min(min, minMsg).max(max, maxMsg).transform(plain)
        .refine(val => val.trim().length >= min, minMsg);

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

// Post = título + descrição + imagem de capa (data URI base64), nada mais.
export const CreatePostSchema = z.object({
    title: sanitizedText(1, 255, "Título é obrigatório", "Título muito longo"),
    description: sanitizedText(1, 10000, "Descrição é obrigatória", "Descrição muito longa"),
    image: z.string().min(1, "Imagem de capa é obrigatória"),
});

export const UpdatePostSchema = z.object({
    title: sanitizedText(1, 255, "Título é obrigatório", "Título muito longo"),
    description: sanitizedText(1, 10000, "Descrição é obrigatória", "Descrição muito longa"),
    image: z.string().optional(),
});
