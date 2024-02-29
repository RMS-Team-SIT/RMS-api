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
  async addWatermarkToPdf(file: Express.Multer.File): Promise<string> {
    const pdfDoc = await PDFDocument.load(file.buffer)
    const pathToThaiFont = path.join(__dirname, '..', '..', 'public', 'fonts', 'Maitree', 'Maitree-Regular.ttf')
    const fontBytes = fs.readFileSync(pathToThaiFont);
    pdfDoc.registerFontkit(fontkit);
    const thaiFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize()
      page.drawText(process.env.WATERMARK_TEXT, {
        x: 5,
        y: height / 2 + 300,
        size: 40,
        font: thaiFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
      });
    });
    // output the watermarked PDF to public/upload
    const fileName = customFileName(null, file, null);
    const outputPath = path.join(__dirname, '..', '..', 'public', 'upload', fileName)
    console.log('outputPath', outputPath);

    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(outputPath, pdfBytes);
    return outputPath;
  }
}
