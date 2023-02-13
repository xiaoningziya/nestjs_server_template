import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    HttpException,
} from '@nestjs/common';
import RootDirname from '@/common/RootDirname';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file) {
        console.log('file', file);
        if (file.filename && file.destination) {
            return {
                filename: file.filename,
                url: 'http://0.0.0.0:3001/' + 'static/upload/' + file.filename,
            };
        } else {
            return new HttpException('上传图片失败', 200);
        }
    }
}
