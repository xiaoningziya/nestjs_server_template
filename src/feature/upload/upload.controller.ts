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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('上传相关接口：/api/upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
    @ApiOperation({ summary: '头像上传接口' })
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file) {
        console.log('file', file);
        if (file.filename && file.destination) {
            return {
                filename: file.filename,
                url:
                    'http://172.16.1.165:3001/' +
                    'static/upload/' +
                    file.filename,
            };
        } else {
            return new HttpException('上传图片失败', 200);
        }
    }
}
