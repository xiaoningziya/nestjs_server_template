import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

export interface UserRo {
    userInfo: UserEntity;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    // 用户注册
    async Register(post: Partial<UserEntity>): Promise<UserEntity> {
        const { account } = post;
        const user = await this.userRepository.findOne({ where: { account } });
        if (user) {
            throw new HttpException('账号已存在', 401);
        }
        return await this.userRepository.save(post);
    }

    // 用户登录
    async Login(post): Promise<UserRo> {
        const { account, password } = post;
        const user = await this.userRepository.findOne({ where: { account } });
        if (!user) {
            throw new HttpException('此账号不存在', 401);
        }
        if (password !== user.password) {
            throw new HttpException('密码不正确', 401);
        }
        return {
            userInfo: user
        }
    }

    // 修改密码
    async UpdatePassword(post): Promise<UserEntity> {
        const { account, old_password, new_password } = post;
        const user = await this.userRepository.findOne({ where: { account } });
        if (!user) {
            throw new HttpException('此账号不存在', 401);
        }
        if (old_password !== user.password) {
            throw new HttpException('原密码不正确', 401);
        }
        const updatePost = this.userRepository.merge(user, {password: new_password});
        return this.userRepository.save(updatePost)
    }

    // 用户登出
    async LoginOut(post): Promise<{}> {
        const { account } = post;
        const user = await this.userRepository.findOne({ where: { account } });
        if (!user) {
            throw new HttpException('此账号不存在', 401);
        }
        return {}
    }
}
