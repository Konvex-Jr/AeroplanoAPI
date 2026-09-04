import multer from "multer";

const storage = multer.memoryStorage();

const multerUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, fieldSize: 2 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Apenas arquivos PDF são permitidos"));
        }
        cb(null, true);
    }
});

export default multerUpload;
