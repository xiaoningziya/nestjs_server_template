import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import RootDirPath from '@/common/RootDirpath';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                /**
                 * 访问地址：http://172.16.1.165/:3001/static/upload/1676272943743.png
                 * 由于根目录配置了虚拟路径，所以<public>需要改成<static>才可以访问
                 */
                destination: join(RootDirPath, '/public/upload'),
                filename: (_, file, callback) => {
                    const fileName = `${
                        new Date().getTime() + extname(file.originalname)
                    }`;
                    return callback(null, fileName);
                },
            }),
            limits: {
                fileSize: 1024 * 1024, // 设置最大上传 1MB
            },
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
