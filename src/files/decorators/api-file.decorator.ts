import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { fileMimetypeFilter } from '../filters/file-mimetype.filter';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { customFileName } from 'src/utils/custom-filename.util';

export function ApiFile(
  fieldName: string = 'file',
  required: boolean = false,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName,
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
    dest: 'public/upload/',
  });
}

export function ApiPdfFile(
  fileName: string = 'document',
  required: boolean = false,
) {
  return ApiFile(fileName, required, {
    fileFilter: fileMimetypeFilter('pdf'),
    dest: 'public/upload/',
  });
}