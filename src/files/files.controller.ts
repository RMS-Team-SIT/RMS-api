import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { FilesService } from './files.service';
import { ApiImageFile, ApiPdfFile } from './decorators/api-file.decorator';
import { ApiImageFiles, ApiPdfFiles } from './decorators/api-files.decorator';
import { ParseFile } from './pipes/file-validation.pipe';
import { SkipThrottle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileMimetypeFilter } from './filters/file-mimetype.filter';

@Controller('files')
@ApiBearerAuth()
@ApiTags('files')
@SkipThrottle()
@Public() //<- For testing only (remove this line in production)
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload-image')
  @ApiImageFile('image', true)
  uploadImage(@UploadedFile(ParseFile) file: Express.Multer.File) {
    console.log(file);
    return {
      message: 'File uploaded successfully',
      fileName: file.filename,
      filePath: file.path,
    };
  }

  @Post('upload-images')
  @ApiImageFiles('images', true)
  uploadFiles(@UploadedFiles(ParseFile) files: Array<Express.Multer.File>) {
    console.log(files);
    const result = {
      message: 'Files uploaded successfully',
      files: [],
    };
    files.forEach((file) => {
      result.files.push({
        fileName: file.filename,
        filePath: file.path,
      });
    });
    return result;
  }

  @Post('upload-pdf')
  @ApiPdfFile('pdf', true)
  uploadPdf(@UploadedFile(ParseFile) file: Express.Multer.File) {
    console.log(file);
    return {
      message: 'File uploaded successfully',
      fileName: file.filename,
      filePath: file.path,
    };
  }

  @Post('upload-pdf-watermark')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['pdf'],
      properties: {
        'pdf': {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('pdf', {
    fileFilter: fileMimetypeFilter('pdf'),
  }))
  async addWatermark(@UploadedFile(ParseFile) file: Express.Multer.File) {
    const { filePath, fileName } = await this.filesService.addWatermarkToPdf(file);
    return {
      message: 'Watermark added successfully',
      fileName,
      filePath
    };
  }

  @Post('upload-pdfs')
  @ApiPdfFiles('pdfs', true)
  uploadPdfs(@UploadedFiles(ParseFile) files: Array<Express.Multer.File>) {
    console.log(files);
    const result = {
      message: 'Files uploaded successfully',
      files: [],
    };
    files.forEach((file) => {
      result.files.push({
        fileName: file.filename,
        filePath: file.path,
      });
    });
    return result;
  }

  // @Post('uploads')
  // @ApiFiles('files', true)
  // uploadFiles(@UploadedFiles(ParseFile) files: Array<Express.Multer.File>) {
  //     console.log(files);
  // }

  // @Post('uploadFields')
  // @ApiFileFields([
  //     { name: 'avatar', maxCount: 1, required: true },
  //     { name: 'background', maxCount: 1 },
  // ])
  // uploadMultipleFiles(@UploadedFiles(ParseFile) files: Express.Multer.File[]) {
  //     console.log(files);
  // }
}
