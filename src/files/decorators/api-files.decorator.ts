import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { fileMimetypeFilter } from '../filters/file-mimetype.filter';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { customFileName } from 'src/utils/custom-filename.util';

export function ApiFiles(
  fieldName: string = 'files',
  required: boolean = false,
  maxCount: number = 10,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(
      fieldName,
      maxCount,
      {
        ...localOptions,
        storage: diskStorage({
          destination: localOptions?.dest || 'public/upload/',
          filename: customFileName,
        })
      })),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
}

export function ApiImageFiles(
  fieldName: string = 'image',
  required: boolean = false,
) {
  return ApiFiles(fieldName, required, 10, {
    fileFilter: fileMimetypeFilter('image'),
    dest: 'public/upload/',
  });
}

export function ApiPdfFiles(
  fileName: string = 'document',
  required: boolean = false,
) {
  return ApiFiles(fileName, required, 10, {
    fileFilter: fileMimetypeFilter('pdf'),
    dest: 'public/upload/',
  });
}