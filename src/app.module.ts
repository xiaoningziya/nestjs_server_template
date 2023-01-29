import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
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

// 业务相关的Modules,组合后在入口解构
const FeatureModuleList: Array<typeof PostsModule> = [
    // tip: 此处的泛型参数不知道类型，可以直接引用子集的类型
    PostsModule,
    UserModule,
    AuthModule,
];
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 设置为全局
            envFilePath: [envConfig.path],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql', // 数据库类型
                entities: [PostsEntity, UserEntity], // 数据表实体
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
    providers: [AppService],
})
export class AppModule {}
