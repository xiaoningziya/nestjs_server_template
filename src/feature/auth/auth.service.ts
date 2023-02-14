import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from '@/redis/redis-cache.service';
import { UserTokenEntity } from '@/feature/auth/auth.entity';
import * as CONST from '@/constant/LengthOfTime';
import * as REDIS from '@/constant/RedisKeyPrefix';
import { ToolsCaptcha } from '@/common/captcha';
import { CreateEncrypt } from '@/common/encrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private readonly toolsCaptcha: ToolsCaptcha,
        private redisCacheService: RedisCacheService,
        @InjectRepository(UserTokenEntity)
        private readonly UserTokenRepository: Repository<UserTokenEntity>,
    ) {}

    // 生成token
    async createToken(user: Partial<UserEntity>) {
        return await this.jwtService.sign(user);
    }

    async login(post, user: Partial<UserEntity>) {
        // 传入 id 和 account 序列化一个token
        const token = await this.createToken({
            id: user.id,
            account: user.account,
        });

        /**
         * @desc token 过期处理
         * 在登录时，将jwt生成的token，存入redis,并设置有效期为30分钟。存入redis的key由用户信息组成， value是token值
         */
        await this.redisCacheService.cacheSet(
            `${REDIS.RedisPrefixToken}${user.id}&${user.account}`,
            token,
            CONST.TOKEN_FIRST_SET_TIME,
        );
        // 组合数据入库
        const row: Partial<UserTokenEntity> = {
            uuid: user.id,
            nickname: user.nickname || '',
            account: user.account || '',
            token: token,
        };
        const findRow = await this.UserTokenRepository.findOne({
            where: { uuid: user.id },
        });
        if (findRow) {
            await this.UserTokenRepository.remove(findRow);
        }
        const newUser = await this.UserTokenRepository.create(row);
        await this.UserTokenRepository.save(newUser);

        return {
            token: token,
            userInfo: {
                id: user.id,
                account: user.account,
                avatar: user.avatar,
                nickname: user.nickname,
            },
        };
    }

    async getUser(user) {
        return await this.userService.findOne(user.id);
    }

    async GetCode(post) {
        const svgCaptcha = await this.toolsCaptcha.captche(); // 创建验证码
        const createID = new CreateEncrypt().nanoid(); // 编码一个id
        this.redisCacheService.cacheSet(
            `${REDIS.RedisPrefixCaptcha}${createID}`,
            `${svgCaptcha.text}`,
            CONST.CAPCODE_FIRST_SET_TIME,
        );
        return {
            key: createID,
            svg: svgCaptcha.data,
        };
    }

    async CompareCode(post) {
        // 验证码校验判断
        if (!post.VerificationCode || !post.VerificationKey) {
            throw new HttpException('缺少验证码', 200);
        } else {
            const key = `${REDIS.RedisPrefixCaptcha}${post.VerificationKey}`;
            const value = await this.redisCacheService.cacheGet(key);
            if (!value) {
                throw new HttpException('验证码不正确', 200);
            } else if (value !== post.VerificationCode) {
                this.redisCacheService.cacheDel(key);
                throw new HttpException('验证码不正确', 200);
            } else {
                // 验证完之后，删掉此验证码
                this.redisCacheService.cacheDel(key);
            }
        }
        return {};
    }
}
