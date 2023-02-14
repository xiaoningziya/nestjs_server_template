/**
 * @file 项目入口文件
 * @desc 尽量轻量化此文件，放到外部目录配置引入
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/transform.filter';
import { ValidationPipe } from '@nestjs/common';
import { PORT, IP } from './constant/ServerListen';
import { SwaggerConfig } from './common/swagger';
import { join } from 'path';
import helmet from 'helmet';
import { JwtAuthGuard } from '@/core/guard/jwt.guard';
// import csurf from 'csurf';

async function runServer() {
    // NestFactory 暴露了一些静态方法用于创建应用程序的实例。
    // 其中，create() 方法返回一个应用程序的对象，该对象实现了 INestApplication 接口
    // 除非您确实需要访问底层平台的API，否则 无需 指定平台类型:<NestExpressApplication>
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true,
    });
    // 设置全局路由前缀
    app.setGlobalPrefix('api');
    // 全局注册过滤器
    app.useGlobalFilters(new HttpExceptionFilter());
    // 全局注册拦截器
    app.useGlobalInterceptors(new TransformInterceptor());
    // 全局注册鉴权守卫
    app.useGlobalGuards(new JwtAuthGuard());
    // 跨域资源共享
    app.enableCors(); // 允许跨站访问 或：const app = await NestFactory.create(AppModule, { cors: true });
    // 防止跨站脚本攻击
    // app.use(helmet()); // 打开配置可能会有跨域问题
    // CSRF保护：跨站点请求伪造
    // app.use(csurf({ cookie: true }));
    // 全局注册 日志中间件
    // app.use(new LoggerMiddleware().use());
    // 设置swagger文档
    new SwaggerConfig(app).Init();
    // 配置静态资源目录
    app.useStaticAssets(join(__dirname, '../../public'), {
        // 配置虚拟目录，比如 http://localhost:3001/static/002.png 来访问public目录里面的文件
        prefix: '/static/', // 设置虚拟路径
    });
    // 配置模板渲染引擎
    app.setBaseViewsDir(join(__dirname, '../../views'));
    /**
     * @desc 配置模版引擎使用规则
     * @params ejs 和 hbs 二选一即可
     */
    app.setViewEngine('ejs');
    // 全局注册一下管道ValidationPipe
    app.useGlobalPipes(new ValidationPipe());
    // 开启服务监听
    await app.listen(PORT, IP);
}
runServer();
