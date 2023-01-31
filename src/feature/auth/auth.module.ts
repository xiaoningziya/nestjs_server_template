import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { LocalStorage } from './local.strategy';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtStorage } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserTokenEntity } from './auth.entity';
import { RedisCacheModule } from '@/db/redis-cache.module';
import { ToolsCaptcha } from '@/common/captcha';

/**
 * 这里不建议将秘钥写死在代码也， 它应该和数据库配置的数据一样，从环境变量中来
 */
const jwtModule = JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        return {
            secret: configService.get('SECRET', 'key'),
            // 先不设置有效期 配合其他代码和<redis>完成<token自动续期>
            // signOptions: { expiresIn: '4h' },
        };
    },
});

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        TypeOrmModule.forFeature([UserTokenEntity]),
        PassportModule,
        jwtModule,
        UserModule,
        RedisCacheModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStorage, JwtStorage, ToolsCaptcha],
    exports: [jwtModule],
})
export class AuthModule {}
