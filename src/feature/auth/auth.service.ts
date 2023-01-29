import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    // 生成token
    async createToken(user: Partial<UserEntity>) {
        return await this.jwtService.sign(user)
    }

    async login(user: Partial<UserEntity>) {
        // 传入 id 和 account 序列化一个token
        const token = await this.createToken({
            id: user.id,
            account: user.account,
        });
        return { token };
    }

    async getUser(user) {
        return await this.userService.findOne(user.id);
    }
}
