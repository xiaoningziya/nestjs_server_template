import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from '@/db/redis-cache.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private redisCacheService: RedisCacheService,
    ) {}

    // 生成token
    async createToken(user: Partial<UserEntity>) {
        return await this.jwtService.sign(user);
    }

    async login(user: Partial<UserEntity>) {
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
            `${user.id}&${user.account}`,
            token,
            1800,
        );
        return { token };
    }

    async getUser(user) {
        return await this.userService.findOne(user.id);
    }
}
