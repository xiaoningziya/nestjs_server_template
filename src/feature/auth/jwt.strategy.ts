/**
 * @file token校验相关
 * @desc JSON Web Token(JWT)
 * @doc 此方案无需维护登录表，简化了前后端交互方案，同时传递给客户端的token使用私钥进行了加密，无需担心安全问题
 *
 * 标记了 @UseGuards(AuthGuard('jwt')) 的控制器会经过此文件的检测
 * 检测请求的header中<Authorization>传递的token是否正确
 */

import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthService } from './auth.service';
import { RedisCacheService } from '@/redis/redis-cache.service';
import { UserTokenEntity } from '@/feature/auth/auth.entity';
import * as CONST from '@/constant/ApiWriteList';
import * as Duration from '@/constant/LengthOfTime';
import * as REDIS from '@/constant/RedisKeyPrefix';

export class JwtStorage extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly redisCacheService: RedisCacheService,
        @InjectRepository(UserTokenEntity)
        private readonly UserTokenRepository: Repository<UserTokenEntity>,
    ) {
        super({
            /**
         * 策略中的ExtractJwt提供多种方式从请求中提取JWT，常见的方式有以下几种：
              fromHeader： 在Http 请求头中查找JWT
              fromBodyField: 在请求的Body字段中查找JWT
              fromAuthHeaderAsBearerToken：在授权标头带有Bearer方案中查找JWT
        */
            /**
             * @desc 这里采用<fromAuthHeaderAsBearerToken>方案
             * @todo 触发方式(header内key:value形式传递)：Authorization: `Bearer ${token}`
             */

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('SECRET'),
            passReqToCallback: true,
        } as StrategyOptions);
    }

    async validate(req, user: UserEntity) {
        console.log('检测', req, user);
        /**
         * @desc 取出token并验证
         * 在验证token时， 从redis中取token，如果取不到token，可能是token已过期。
         */
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        const cacheToken = await this.redisCacheService.cacheGet(
            `${REDIS.RedisPrefixToken}${user.id}&${user.account}`,
        );
        if (!cacheToken) {
            throw new UnauthorizedException('token 已过期');
        }

        /**
         * @desc 用户唯一登录
         * 当用户登录时，每次签发的新的token,会覆盖之前的token,
         * 判断redis中的token与请求传入的token是否相同， 不相同时， 可能是其他地方已登录， 提示token错误
         */
        if (token != cacheToken) {
            throw new UnauthorizedException('token不正确');
        }

        const existUser = await this.authService.getUser(user);
        if (!existUser) {
            throw new UnauthorizedException('token不正确');
        }

        /**
         * 在token认证通过后，重新设置过期时间
         * 因为使用的cache-manager没有通过直接更新有效期方法，通过重新设置来实现
         */
        // 忽略无需续签的接口队列
        if (!CONST.TOKEN_AUTOMATIC_RENEWAL_IGNORE_LIST.includes(req.url)) {
            this.redisCacheService.cacheSet(
                `${REDIS.RedisPrefixToken}${user.id}&${user.account}`,
                token,
                Duration.TOKEN_AUTOMATIC_RENEWAL_TIME,
            );
            const findRow = await this.UserTokenRepository.findOne({
                where: { uuid: user.id },
            });
            /**
             * 使用<dayjs>的时间方法生成时间字符串替换库中的<update_time>
             */
            findRow.update_time = new Date();
            console.log('时间转时间戳方法==>', findRow.update_time.getTime());
            const updatePost = this.UserTokenRepository.merge(findRow, {});
            await this.UserTokenRepository.save(updatePost);
        }
        return existUser;
    }
}
