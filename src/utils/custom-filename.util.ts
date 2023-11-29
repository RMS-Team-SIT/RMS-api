import { extname } from "path";

export const customFileName = (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = extname(file.originalname);
    const baseName = file.fieldname.replace(/\s+/g, '_').toLowerCase();
    callback(null, `${baseName}-${uniqueSuffix}${extension}`);
}