import sharp, { FormatEnum } from "sharp";
import AppError from "../../domain/AppError";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const VALID_PREFIXES: { prefix: string; format: keyof FormatEnum }[] = [
    { prefix: "data:image/jpeg", format: "jpeg" },
    { prefix: "data:image/png", format: "png" },
    { prefix: "data:image/webp", format: "webp" },
];

export async function validateAndSanitizeImage(image: string): Promise<string> {
    if (!image) return image;

    const match = VALID_PREFIXES.find(p => image.startsWith(p.prefix));
    if (!match) throw new AppError("Imagem deve ser JPEG, PNG ou WebP em base64");

    const base64data = image.split(",")[1] ?? "";
    const inputBuffer = Buffer.from(base64data, "base64");
    if (inputBuffer.length > MAX_IMAGE_BYTES) throw new AppError("Imagem excede 2MB");

    let outputBuffer: Buffer;
    try {
        outputBuffer = await sharp(inputBuffer)
            .toFormat(match.format)
            .toBuffer();
    } catch {
        throw new AppError("Imagem inválida ou corrompida");
    }

    return `${match.prefix};base64,${outputBuffer.toString("base64")}`;
}