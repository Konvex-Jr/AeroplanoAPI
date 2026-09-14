import { PDFDocument, PDFDict, PDFName, PDFArray } from "pdf-lib";
import AppError from "../../domain/AppError";

const PDF_MAGIC = Buffer.from("%PDF-");

const JS_KEYS = [
    PDFName.of("JS"),
    PDFName.of("JavaScript"),
    PDFName.of("AA"),
    PDFName.of("OpenAction"),
    PDFName.of("Launch"),
    PDFName.of("SubmitForm"),
    PDFName.of("ImportData"),
];

function stripJsFromDict(dict: PDFDict): void {
    for (const key of JS_KEYS) {
        dict.delete(key);
    }
}

function walkObject(obj: unknown, visited = new Set<unknown>()): void {
    if (!obj || visited.has(obj)) return;
    visited.add(obj);

    if (obj instanceof PDFDict) {
        stripJsFromDict(obj);
        for (const value of obj.values()) {
            walkObject(value, visited);
        }
    } else if (obj instanceof PDFArray) {
        for (const item of obj.asArray()) {
            walkObject(item, visited);
        }
    }
}

export async function validateAndSanitizePdf(buffer: Buffer): Promise<Buffer> {
    if (buffer.length < 5 || !buffer.subarray(0, 5).equals(PDF_MAGIC)) {
        throw new AppError("Arquivo não é um PDF válido");
    }

    let pdfDoc: PDFDocument;
    try {
        pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    } catch {
        throw new AppError("PDF corrompido ou inválido");
    }

    // Strip JS from every object in the document
    const context = pdfDoc.context;
    for (const obj of context.enumerateIndirectObjects()) {
        walkObject(obj[1]);
    }

    // Strip document-level AA and OpenAction from the catalog
    const catalog = pdfDoc.catalog;
    stripJsFromDict(catalog);

    const sanitized = await pdfDoc.save();
    return Buffer.from(sanitized);
}
