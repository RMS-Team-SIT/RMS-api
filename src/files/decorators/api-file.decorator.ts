import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { fileMimetypeFilter } from '../filters/file-mimetype.filter';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';

export function ApiFile(
  fieldName: string = 'file',
  required: boolean = false,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName,
        { ...localOptions, storage: diskStorage({
          destination: localOptions.dest || 'public/upload/',
          filename: customFileName,
        }) })),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export function ApiImageFile(
  fieldName: string = 'image',
  required: boolean = false,
) {
  return ApiFile(fieldName, required, {
    fileFilter: fileMimetypeFilter('image'),
    dest: 'public/upload/img/',
  });
}

export function ApiPdfFile(
  fileName: string = 'document',
  required: boolean = false,
) {
  return ApiFile(fileName, required, {
    fileFilter: fileMimetypeFilter('pdf'),
    dest: 'public/upload/pdf/',
  });
}

const customFileName = (req, file, callback) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const extension = extname(file.originalname);
  const baseName = file.fieldname.replace(/\s+/g, '_').toLowerCase();
  callback(null, `${baseName}-${uniqueSuffix}${extension}`);
}