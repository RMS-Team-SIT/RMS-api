import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { FilesService } from './files.service';
import { ApiFile, ApiImageFile, ApiPdfFile } from './decorators/api-file.decorator';
import { ApiFiles } from './decorators/api-files.decorator';
import { ApiFileFields } from './decorators/api-file-fields.decorator';
import { fileMimetypeFilter } from './filters/file-mimetype.filter';
import { ParseFile } from './pipes/file-validation.pipe';

@Controller('files')
@ApiTags('files')
@Public()
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload-image')
    @ApiImageFile('image', true)
    uploadFile(
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log(file);
        return {
            message: 'File uploaded successfully',
            url: `/upload/img/${file.filename}`
        }
    }

    @Post('uploads')
    @ApiFiles('files', true)
    uploadFiles(@UploadedFiles(ParseFile) files: Array<Express.Multer.File>) {
        console.log(files);
    }

    @Post('uploadFields')
    @ApiFileFields([
        { name: 'avatar', maxCount: 1, required: true },
        { name: 'background', maxCount: 1 },
    ])
    uploadMultipleFiles(@UploadedFiles(ParseFile) files: Express.Multer.File[]) {
        console.log(files);
    }
}
