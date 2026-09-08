import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export type NULL = null

export type UNDEFINED = undefined

// Sanitizes Text Inputs
const plain = (val: string) => sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });

const sanitizedText = (min: number, max: number, minMsg: string, maxMsg: string) => z.string().min(min, minMsg).max(max, maxMsg).transform(plain);

// Create User Body Schema
export const RegisterSchema = z.object({
    email: z.string().email("Invalid Email."),
    password: z.string().min(8, "Password must contain at least 8 characters."),
});

// Login User Body Schema
export const LoginSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(1, "Password is Required."),
});

// Create Post Body Schema
export const CreatePostSchema = z.object({
    title: sanitizedText(1, 255, "Title is Required.", "Title is too Long."),
    image: z.instanceof(Buffer).optional(),
    content: sanitizedText(1, 10000, "Content is Required.", "Content is too Long."),
});

// Update Post Body Schema
export const UpdatePostSchema = z.object({
    title: sanitizedText(1, 255, "Title must contain at least 1 character.", "Title is too Long.").optional(),
    image: z.instanceof(Buffer).optional(),
    content: sanitizedText(1, 10000, "Content must contain at least 1 character.", "Content is too Long.").optional(),
});

// Delete Post Body Schema
export const DeletePostSchema = z.object({
    id: z.string()
})

// Acces Token Cookie Schema

// Validate the : "Authorization": "Bearer eijh2813jdn72ydhku2h2i7hub..." PATTERN
export const AccessTokenSchema = z.string().startsWith("Bearer ").transform((val) => val.split(' ')[1])