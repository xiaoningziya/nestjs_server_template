import {
    DynamicModule,
    ForwardReference,
    MiddlewareConsumer,
    Module,
    RequestMethod,
    Type,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PostsModule } from './feature/posts/posts.module';
import { UserModule } from './feature/user/user.module';
import { AuthModule } from './feature/auth/auth.module';
import envConfig from '../config/env';
import { PostsEntity } from './feature/posts/posts.entity';
import { UserEntity } from './feature/user/user.entity';
import { UserTokenEntity } from '@/feature/auth/auth.entity';
import { RedisCacheModule } from '@/redis/redis-cache.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from '@/core/middleware/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from '@/feature/tasks/tasks.module';
import { UploadModule } from '@/feature/upload/upload.module';

// 业务相关的Modules,组合后在入口解构
const FeatureModuleList: Array<typeof PostsModule> = [
    // tip: 此处的泛型参数不知道类型，可以直接引用子集的类型
    PostsModule,
    UserModule,
    AuthModule,
    RedisCacheModule,
    UploadModule,
];
// 数据表集合
const Entities: Array<any> = [PostsEntity, UserEntity, UserTokenEntity];
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 设置为全局
            envFilePath: [envConfig.path],
        }),
        ScheduleModule.forRoot(),
        TasksModule,
        /**
         * @desc 限速：限制客户端在一定时间内的请求次数
         */
        ThrottlerModule.forRoot({
            ttl: 60, //  <== 时间内(单位：秒)
            limit: 300, // <== 最多请求的次数(超过次数会被服务端返回)
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql', // 数据库类型
                entities: Entities, // 数据表实体
                // autoLoadEntities: true, // 可以打开此配置项，表示<entities>配置自动引入，避免忘记
                host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
                port: configService.get<number>('DB_PORT', 3306), // 端口号
                username: configService.get('DB_USER', 'root'), // 用户名
                password: configService.get('DB_PASSWORD', 'rootpass'), // 密码
                database: configService.get('DB_DATABASE', 'NestData'), //数据库名
                timezone: '+08:00', // 服务器上配置的时区
                synchronize: true, // 根据实体自动创建数据库表， 生产环境建议关闭
            }),
        }),
        ...FeatureModuleList,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware) // 应用中间件
            // .exclude({ path: 'user', method: RequestMethod.POST }) // 排除user的post方法
            .forRoutes('*'); // 监听路径  参数：路径名或*，*是匹配所以的路由
        // .forRoutes({ path: 'user', method: RequestMethod.POST }, { path: 'album', method: RequestMethod.ALL }); //多个
        // .apply(UserMiddleware) // 支持多个中间件
        // .forRoutes('user')
    }
}
