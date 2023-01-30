import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from '@/db/redis-cache.service';
import { UserTokenEntity } from '@/feature/auth/auth.entity';
import * as CONST from '@/constant/token';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private redisCacheService: RedisCacheService,
        @InjectRepository(UserTokenEntity)
        private readonly UserTokenRepository: Repository<UserTokenEntity>,
    ) {}

    // 生成token
    async createToken(user: Partial<UserEntity>) {
        return await this.jwtService.sign(user);
    }

    async login(user: Partial<UserEntity>, req) {
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
            await this.UserTokenRepository.delete({ uuid: user.id });
        }
        const newUser = await this.UserTokenRepository.create(row);
        await this.UserTokenRepository.save(newUser);

        return { token };
    }

    async getUser(user) {
        return await this.userService.findOne(user.id);
    }
}
