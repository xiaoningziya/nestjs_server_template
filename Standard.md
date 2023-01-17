# 开发环境
- NodeJS `16.18.1`
- npm `8.19.2`

# 准备条件
- 数据库： `mysql-8.0.31macos12`
- 可视化： `MySQL Workbench community-8.0.27`
- 文档使用Swagger `http://localhost:3001/docs`
- 测试接口使用ApiPost
- 连接是数据库使用：`TypeORM`
- 验证入参配置DTO规则 `class-validator`
- 包装出参全局配置 过滤器 & 拦截器

# VSCode 工具
- `Nest-Server-Tools`
- `NestJS Files`
- `NestJS Files`

# 核心文件
- `app.controller.ts`	带有单个路由的基本控制器。
- `app.controller.spec.ts`	针对控制器的单元测试。
- `app.module.ts`	T应用程序的根模块（root module）。
- `app.service.ts`	具有单一方法的基本服务（service）。 method.
- `main.ts`	应用程序的入口文件，它使用核心函数 **NestFactory** 来创建 Nest 应用程序的实例。

# TS Class 方法修饰符
- `public`：修饰的属性与方法是共有的，默认；
- `private`：修饰的属性和方法是私有的，只能在class里使用，通过该类new出来的实例、继承的子类也不能使用；
- `protected`：修饰的属性与方法是受保护的，继承的子类可以使用

# Controller 控制器
> 如果在方法参数中定义了 @Res() 或 @Next()，此时该方法的 return 语句会被阻塞。此时必须使用 res.send / res.end / res.json 等
- `@Get()、@Post()、@Put()、@Patch()、@Delete()、@Options()、@Head()、@All()` Controller控制器下的 请求方式
- `@Request()`	req
- `@Response()`	res
- `@Next()`	next
- `@Session()`	req.session
- `@Param(param?: string)`	req.params / req.params[param]
- `@Body(param?: string)`	req.body / req.body[param]
- `@Query(param?: string)`	req.query / req.query[param]
- `@Headers(param?: string)`	req.headers / req.headers[param]
- `@HttpCode(200)` 改变http状态码,但是在实际项目终于一般是会有统一的响应处理器来处理http响应
- `@Header('Cache-Control', 'none')` 给我们的响应设置响应头，同样我们也可以直接使用`@Res`装饰器拿到响应的响应头

# Provider 提供者
> 在类声明上，定义 @Injectable() 装饰器，即可将该类定义为提供者

# Module 模块(核心依赖注入思想)
> .mudule文件需要使用一个`@Module()` 装饰器的类，装饰器可以理解成一个封装好的函数
> `@Module()` 装饰器接收四个属性：providers、controllers、imports、exports。
- `providers`：Nest.js注入器实例化的提供者（服务提供者），处理具体的业务逻辑，各个模块之间可以共享（注入器的概念后面依赖注入部分会讲解）；
- `controllers`：处理http请求，包括路由控制，向客户端返回响应，将具体业务逻辑委托给providers处理；
- `imports`：导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入；
- `exports`：导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出；

# NestJS 实体
```
<!-- 自动递增的主键 -->
@PrimaryGeneratedColumn()
id:number

<!-- 自动递增uuid -->
@PrimaryGeneratedColumn("uuid")
id:number

<!-- 自动生成列 -->
@Generated('uuid')
uuid:string

<!-- 枚举列 -->
@Column({
    type:"enum",
    enum:['1','2','3','4'],
    default:'1'
})
xx:string
```

# @Column 可选配置
```
@Column({
    unique: boolean - 将列标记为唯一列（创建唯一约束）
    type: "varchar", // 数据库的列类型
    name: "ipaaa", // 数据库表中的列名
    length: number - 列类型的长度。 例如，如果要创建varchar（150）类型，请指定列类型和长度选项
    nullable: true, // 在数据库中使列NULL或NOT NULL。 默认情况下，列是nullable：false
    comment: "注释", // 数据库列备注，并非所有数据库类型都支持
    select: true,  // 定义在进行查询时是否默认隐藏此列。 设置为false时，列数据不会显示标准查询。 默认情况下，列是select：true
    default: "xxxx", // 加数据库级列的DEFAULT值
    primary: false, // 将列标记为主要列 使用方式和@PrimaryColumn相同。
    update: true, // 指示"save"操作是否更新列值。如果为false，则只能在第一次插入对象时编写该值。 默认值为"true"
    collation: "", //定义列排序规则
    enum: string[]|AnyEnum - 在enum列类型中使用，以指定允许的枚举值列表。 你也可以指定数组或指定枚举类
})
```
# 特殊的列类型
- simple-array
    > 有一种称为simple-array的特殊列类型，它可以将原始数组值存储在单个字符串列中。 所有值都以逗号分隔
    ```
    @Entity()
    export class User {
        @PrimaryGeneratedColumn()
        id: number;
    
        @Column("simple-array")
        names: string[];
    }
    ```
- simple-json
    > 还有一个名为simple-json的特殊列类型，它可以存储任何可以通过 JSON.stringify 存储在数据库中的值。 当你的数据库中没有 json 类型而你又想存储和加载对象，该类型就很有用了
    ```
    @Entity()
    export class User {
        @PrimaryGeneratedColumn()
        id: number;
    
        @Column("simple-json")
        profile: { name: string; nickname: string };
    }
    ```

# 路由的控制 (RESTful API)
- HTTP `GET` 请求：用于查询资源。例如：'/users' 用于查询所有用户。
- HTTP `POST` 请求：用于创建新资源。例如：'/users' 用于创建新用户。
- HTTP `PUT` 请求：用于更新已有资源。例如：'/users/1' 用于更新 id 为 1 的用户。
- HTTP `DELETE` 请求：用于删除已有资源。例如：'/users/1' 用于删除 id 为 1 的用户。
> UsersController 控制器使用 @Get、@Post、@Put、@Delete 装饰器声明了若干个路由处理程序。分别对应了 HTTP GET、POST、PUT 和 DELETE 请求。
> 你也可以使用 app.route().get()、app.route().post() 等方法来实现 RESTful API。 


