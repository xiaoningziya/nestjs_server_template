# 平台能力

> 目前支持两个 HTTP 平台：**express** 和 **fastify**。 您可以根据您的需求选择最适合平台。

-   `platform-express`： Express 是一个著名的、极简的、专为 node 开发的 web 框架。它久经考验、适用于生产环境的软件库，并且拥有大量的社区资源。默认情况下使用 @nestjs/platform-express 软件包。许多用户对 Express 都很满意，并且无需采取任何操作即可启用它
-   `platform-fastify`：Fastify 是一个高性能且低开销的框架，高度专注于提供最高的效率和速度
    > 无论使用那个平台，都会将平台的 application 接口暴露出来。它们分别是 **NestExpressApplication** 和 **NestFastifyApplication**

# Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Installation

```bash
$ npm install
```

# Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
