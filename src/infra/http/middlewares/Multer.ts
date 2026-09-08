import multer from "multer";

const storage = multer.memoryStorage();

// Setup Multer
const fileUpload = multer({
    storage,
    dest: "uploads/",
    limits: { 
        fileSize: 10 * 1024 * 1024 ,  // 10MB 
        fieldSize: 2 * 1024 * 1024    // 2MB
    },
    fileFilter(_req, file, cb) {
    
        const { mimetype } = file

        const MIME_TYPE_REGEX = /^image\/(jpeg|png|webp)$/i

        if(!MIME_TYPE_REGEX.test(mimetype)) cb(new Error("Invalid Format."))

        cb(null, true); 
    },
});

export default fileUpload;
