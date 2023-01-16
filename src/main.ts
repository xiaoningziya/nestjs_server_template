import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/transform.filter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    // NestFactory 暴露了一些静态方法用于创建应用程序的实例。
    // 其中，create() 方法返回一个应用程序的对象，该对象实现了 INestApplication 接口
    const app = await NestFactory.create<NestExpressApplication>(AppModule); // 除非您确实需要访问底层平台的API，否则 无需 指定平台类型:<NestExpressApplication>
    // 设置全局路由前缀
    app.setGlobalPrefix('api')
    // 全局注册过滤器
    app.useGlobalFilters(new HttpExceptionFilter());
    // 全局注册拦截器
    app.useGlobalInterceptors(new TransformInterceptor());
    // 设置swagger文档
    const config = new DocumentBuilder()
        .setTitle('NestJS提供服务')
        .setDescription('管理后台接口文档')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    // 全局注册一下管道ValidationPipe
    app.useGlobalPipes(new ValidationPipe());
    // 开启服务监听
    await app.listen(3001);
}
bootstrap();
