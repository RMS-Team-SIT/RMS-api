import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import * as fs from 'fs';
import { customFileName } from 'src/utils/custom-filename.util';
import * as fontkit from 'fontkit';

@Injectable()
export class FilesService {
  constructor() {
    // Register fontkit with PDFDocument
  }
  async addWatermarkToPdf(
    file: Express.Multer.File,
  ): Promise<{ fileName: string; filePath: string }> {
    const pdfDoc = await PDFDocument.load(file.buffer);
    // const pathToThaiFont = path.join(__dirname, '..', '..', 'public', 'fonts', 'Maitree', 'Maitree-Regular.ttf')
    const pathToThaiFont = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'fonts',
      'Sarabun',
      'Sarabun-Regular.ttf',
    );
    const fontBytes = fs.readFileSync(pathToThaiFont);
    pdfDoc.registerFontkit(fontkit);
    const thaiFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = Math.max(width, height) * 0.05; // Adjust the multiplier as needed
      const textWidth = thaiFont.widthOfTextAtSize(
        process.env.WATERMARK_TEXT,
        fontSize,
      );
      const textHeight = thaiFont.heightAtSize(fontSize);

      const x = 0;
      const y = height / 2 + 300;

      const angle = Math.atan(height / width); // Calculate angle for diagonal text
      const customDegree = angle * (180 / Math.PI); // Convert radians to degrees

      page.drawText(process.env.WATERMARK_TEXT, {
        x,
        y,
        size: fontSize,
        font: thaiFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-customDegree),
      });
    });
    // output the watermarked PDF to public/upload
    const fileName = customFileName(null, file, null);
    const outputPath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'upload',
      fileName,
    );
    console.log('outputPath', outputPath);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    return { fileName, filePath: outputPath };
  }
}
