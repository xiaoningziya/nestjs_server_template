# TypeScript Class 方法修饰符

-   `public`：修饰的属性与方法是共有的，默认；
-   `private`：修饰的属性和方法是私有的，只能在 class 里使用，通过该类 new 出来的实例、继承的子类也不能使用；
-   `protected`：修饰的属性与方法是受保护的，继承的子类可以使用

# NestJS Controller 控制器

> 如果在方法参数中定义了 @Res() 或 @Next()，此时该方法的 return 语句会被阻塞。此时必须使用 res.send / res.end / res.json 等

-   `@Get()、@Post()、@Put()、@Patch()、@Delete()、@Options()、@Head()、@All()` Controller 控制器下的 请求方式
-   `@Request()` req
-   `@Response()` res
-   `@Next()` next
-   `@Session()` req.session
-   `@Param(param?: string)` req.params / req.params[param]
-   `@Body(param?: string)` req.body / req.body[param]
-   `@Query(param?: string)` req.query / req.query[param]
-   `@Headers(param?: string)` req.headers / req.headers[param]
-   `@HttpCode(200)` 改变 http 状态码,但是在实际项目终于一般是会有统一的响应处理器来处理 http 响应
-   `@Header('Cache-Control', 'none')` 给我们的响应设置响应头，同样我们也可以直接使用`@Res`装饰器拿到响应的响应头

# NestJS Provider 提供者

> 在类声明上，定义 @Injectable() 装饰器，即可将该类定义为提供者

# Module 模块(核心依赖注入思想)

> .mudule 文件需要使用一个`@Module()` 装饰器的类，装饰器可以理解成一个封装好的函数
> `@Module()` 装饰器接收四个属性：providers、controllers、imports、exports。

-   `providers`：**服务提供者**（处理具体的业务逻辑，各个模块之间可以共享）
-   `controllers`：**处理 http 请求，包括路由控制，向客户端返回响应**（将具体业务逻辑委托给 providers 处理）
-   `imports`：**导入模块的列表**（如果需要使用其他模块的服务，需要通过这里导入）
-   `exports`：**导出服务的列表**（供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出）

# 路由的控制 (RESTful API)

-   HTTP `GET` 请求：用于查询资源。例如：'/users' 用于查询所有用户。
-   HTTP `POST` 请求：用于创建新资源。例如：'/users' 用于创建新用户。
-   HTTP `PUT` 请求：用于更新已有资源。例如：'/users/1' 用于更新 id 为 1 的用户。
-   HTTP `DELETE` 请求：用于删除已有资源。例如：'/users/1' 用于删除 id 为 1 的用户。
    > UsersController 控制器使用 @Get、@Post、@Put、@Delete 装饰器声明了若干个路由处理程序。分别对应了 HTTP GET、POST、PUT 和 DELETE 请求。
    > 你也可以使用 app.route().get()、app.route().post() 等方法来实现 RESTful API。

# 实体监听装饰器

> 其实是 typeorm 在操作数据库时的生命周期，可以更方便的操作数据

-   查找后：`@AfterLoad`
-   插入前：`@BeforeInsert`
-   插入后：`@AfterInsert`
-   更新前：`@BeforeUpdate`
-   更新后：`@AfterUpdate`
-   删除前：`@BeforeRemove`

# 增删改查的三种方式

> 其实底层最终都会生成 sql 语句，只是封装了几种方式而已，方便人们使用

-   第一种：使用 sql 语句，适用于 sql 语句熟练的同学
-   第二种：typeorm 封装好的方法，增删改 + 简单查询
-   第三种：QueryBuilder 查询生成器，适用于关系查询，多表查询，复杂查询

# `Query Builder` & `Repository API` 的不同用法

```
// 设置缓存 - queryBuilder

const users = await connection
  .createQueryBuilder(User, "user")
  .where("user.isAdmin = :isAdmin", { isAdmin: true })
  .cache("users_admins", 25000)
  .getMany();


// 设置缓存 - repository
const users = await connection.getRepository(User).find({
  where: { isAdmin: true },
  cache: {
    id: "users_admins",
    milisseconds: 25000
  }
});

// 清理缓存
await connection.queryResultCache.remove(["users_admins"]);
```
