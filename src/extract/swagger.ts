/**
 * @file 配置 Swagger文档
 * @desc 此配置在main主入口调用Init即可
 */
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as CONST from '../constant/swagger'

export class SwaggerConfig {
    app: NestExpressApplication;
    constructor(app: NestExpressApplication) {
        this.app = app
    }
    public Init(): void {
        const config = new DocumentBuilder()
            .setTitle(CONST.TITLE)
            .setDescription(CONST.DESC)
            .addBearerAuth() // 为了可以顺畅的使用Swagger来测试传递bearer token接口
            .setVersion(CONST.VER)
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(this.app, config);
        SwaggerModule.setup('docs', this.app, document);
    }
}