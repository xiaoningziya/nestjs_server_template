## 开发环境

-   NodeJS `16.18.1`
-   npm `8.19.2`

## 查阅文档

[NestJS 开源项目](https://github.com/nestjs/nest)

[NestJS 英文文档](https://docs.nestjs.com/)

[NestJS 中文文档](https://www.nestjs.com.cn/)

[NestJS 9.x 版本 中文文档](https://docs.nestjs.cn/9/introduction)

[TypeORM 中文文档](https://typeorm.bootcss.com/caching)

[TypeORM 英文文档](https://typeorm.io/)

## 下载依赖

```bash
$ npm install
```

## 运行服务 (运行服务前应当开启两个其它服务：`mysql` & `redis`)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## VSCode 工具

-   `Nest-Server-Tools`
-   `NestJS Files`
-   `NestJs Snippets`
-   `Database Client`
-   `ESLint`
-   `Prettier ESLint`
-   `Prettier - Code formatter`

## 核心文件

-   `app.controller.ts` 带有单个路由的基本控制器。
-   `app.controller.spec.ts` 针对控制器的单元测试。
-   `app.module.ts` T 应用程序的根模块（root module）。
-   `app.service.ts` 具有单一方法的基本服务（service）。 method.
-   `main.ts` 应用程序的入口文件，它使用核心函数 **NestFactory** 来创建 Nest 应用程序的实例。

## 项目组成

-   文档使用 Swagger `http://localhost:3001/docs`
-   测试接口使用 `ApiPost`
-   映射数据库表使用：`TypeORM`
-   验证入参配置 DTO 规则 `class-validator`
-   包装出参全局配置 `过滤器 & 拦截器`
-   前后端认证方案使用 `JWT`
-   可视化： `MySQL Workbench community-8.0.27`
-   数据库： `mysql-8.0.31macos12`
    -   启动方式：`在偏好设置的mysql入口start server即可`
    -   域名：`localhost`
    -   端口：`3306`
    -   用户：`root`
    -   密码：`rootpass`
    -   库名：`NestData`
-   缓存方案使用`redis`
    -   启动命令：
        ```bash
        $ /opt/homebrew/opt/redis/bin/redis-server /opt/homebrew/etc/redis.conf
        ```
    -   域名：`127.0.0.1`
    -   端口：`6379`
    -   密码：`182`

# 平台能力

> 目前支持两个 HTTP 平台：**express** 和 **fastify**。 您可以根据您的需求选择最适合平台。

-   `platform-express`： Express 是一个著名的、极简的、专为 node 开发的 web 框架。它久经考验、适用于生产环境的软件库，并且拥有大量的社区资源。默认情况下使用 @nestjs/platform-express 软件包。许多用户对 Express 都很满意，并且无需采取任何操作即可启用它
-   `platform-fastify`：Fastify 是一个高性能且低开销的框架，高度专注于提供最高的效率和速度
    > 无论使用那个平台，都会将平台的 application 接口暴露出来。它们分别是 **NestExpressApplication** 和 **NestFastifyApplication**
