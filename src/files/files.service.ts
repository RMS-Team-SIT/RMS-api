import { Injectable } from '@nestjs/common';
import path, { extname } from 'path';

@Injectable()
export class FilesService {
    async handleFileUpload(file: Express.Multer.File): Promise<string> {
        // You can implement your file handling logic here
        // For example, you might want to save the file to the 'uploads' directory
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + extname(file.originalname);
        
        // Move the file to the 'uploads' directory
        const destinationPath = path.join(__dirname, '../../uploads', fileName);
        // await fs.promises.rename(file.path, destinationPath);
    
        return fileName;
      }
}
