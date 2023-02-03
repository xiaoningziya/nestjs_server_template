import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { RedisCacheService } from '@/db/redis-cache.service';
import { UserTokenEntity } from '@/feature/auth/auth.entity';
var bcrypt = require('bcryptjs');
export interface UserRo {
    userInfo: UserEntity;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private redisCacheService: RedisCacheService,
        @InjectRepository(UserTokenEntity)
        private readonly UserTokenRepository: Repository<UserTokenEntity>,
    ) {}

    async findOne(id: string) {
        return await this.userRepository.findOne({ where: { id: id } });
    }

    // 用户注册
    async Register(post: Partial<UserEntity>): Promise<{}> {
        const { account } = post;
        const user = await this.userRepository.findOne({ where: { account } });
        if (user) {
            throw new HttpException('账号已存在', 200);
        }
        /**
         * @desc 问题标记 
         * 
         * 直接Save,并不会触发@BeforeInsert和@BeforeUpdate,
                async create(attributes: DeepPartial<T>) {
                    return this.repository.save(attributes); // 不会触发BeforeInsert
                }
         * 解决办法
                方法一、利用plainToClass
                async create(attributes: DeepPartial<T>) {
                    const entity = plainToClass(Admin, attributes);
                    return this.repository.save(entity);
                }

                方法二、利用new Entiry()
                async create(attributes: DeepPartial<T>) {
                    const entiry = Object.assign(new Admin(), attributes)
                    return this.repository.save(entiry);
                }

                方法三、利用Entity.create(EntitySchema)
                async create(dataDto: DataDto) {
                    const entityDto = this.respository.create(dataDto)
                    return this.repository.save(entityDto);
                }
         */
        const newUser = await this.userRepository.create(post);
        await this.userRepository.save(newUser);
        return {};
    }

    // 修改密码
    async UpdatePassword(post, userInfo): Promise<{}> {
        const { id, password, account } = userInfo;
        const { old_password, new_password } = post;
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('此账号不存在', 200);
        }
        // 判断新旧密码一致性
        // 使用<compareSync>方法进行新旧密码对比
        if (new_password === old_password) {
            throw new HttpException('新密码与原密码一致', 200);
        }
        if (!bcrypt.compareSync(old_password, password)) {
            throw new HttpException('原密码不正确', 200);
        }
        // 将新密码单独加密
        const salt = await bcrypt.genSaltSync(10);
        const endPWD = await bcrypt.hashSync(new_password, salt);
        // 合并数据并入库
        const updatePost = this.userRepository.merge(user, {
            password: endPWD,
        });
        // 清除redis存储的token,引导用户重新登录
        this.redisCacheService.cacheDel(`${id}&${account}`);
        await this.userRepository.save(updatePost);
        return {};
    }

    // 用户登出
    async LoginOut(post, userInfo): Promise<{}> {
        const { id, account } = userInfo;
        // const user = await this.userRepository.findOne({ where: { id } });
        // 删除登录表中的此用户
        this.UserTokenRepository.delete({ uuid: id });
        // 清除redis存储的token
        this.redisCacheService.cacheDel(`${id}&${account}`);
        return {};
    }

    // 创建用户假数据
    async mockData() {
        const new_user = {
            account: String(
                Math.floor(Math.random() * 10 + new Date().getTime()),
            ),
            password: '111',
        };
        const user = await this.userRepository.findOne({
            where: { account: new_user.account },
        });
        if (user) return;
        const newUser = await this.userRepository.create(new_user);
        await this.userRepository.save(newUser);
    }
}
