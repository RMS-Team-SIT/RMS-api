import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
    metadata: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    console.log('Validation Pipe called');

    if (files === undefined || files === null) {
      console.log('File is undefined or null');
      throw new BadRequestException('Validation failed (file expected)');
    }

    if (Array.isArray(files) && files.length === 0) {
      console.log('File is empty array');
      throw new BadRequestException('Validation failed (files expected)');
    }

    // validate size
    const maxSize = 1024 * 1024 * 100; // 100MB
    if (Array.isArray(files)) {
      for (const file of files) {
        if (file.size > maxSize) {
          console.log('File is too large');
          throw new BadRequestException('Validation failed (file too large)');
        }
      }
    } else {
      if (files.size > maxSize) {
        console.log('File is too large');
        throw new BadRequestException('Validation failed (file too large)');
      }
    }
    console.log('Validation passed');
    return files;
  }
}
