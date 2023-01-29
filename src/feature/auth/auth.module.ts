import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { LocalStorage } from './local.strategy';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config';
import { JwtStorage } from './jwt.strategy'
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module'

/**
 * 这里不建议将秘钥写死在代码也， 它应该和数据库配置的数据一样，从环境变量中来
 */
const jwtModule = JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
            secret: configService.get('SECRET', 'key'),
            signOptions: { expiresIn: '4h' },
      };
    },
});

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule,
        jwtModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStorage,
        JwtStorage,
    ],
    exports: [jwtModule],
})

export class AuthModule { }