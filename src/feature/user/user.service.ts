import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
var bcrypt = require('bcryptjs');
export interface UserRo {
    userInfo: UserEntity;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findOne(id: string) {
        return await this.userRepository.findOne({ where: { id: id } });
    }

    // 用户注册
    async Register(post: Partial<UserEntity>): Promise<UserEntity> {
        const { account } = post;
        const user = await this.userRepository.findOne({ where: { account } });
        if (user) {
            throw new HttpException('账号已存在', 401);
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
        return await this.userRepository.save(newUser);
    }

    // 修改密码
    async UpdatePassword(post, userInfo): Promise<UserEntity> {
        const { id, password } = userInfo;
        const { old_password, new_password } = post;
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('此账号不存在', 401);
        }
        // 判断新旧密码一致性
        // 使用<compareSync>方法进行新旧密码对比
        if (new_password === old_password) {
            throw new HttpException('新密码与原密码一致', 401);
        }
        if (!bcrypt.compareSync(old_password, password)) {
            throw new HttpException('原密码不正确', 401);
        }
        // 将新密码单独加密
        const salt = await bcrypt.genSaltSync(10);
        const endPWD = await bcrypt.hashSync(new_password, salt);
        // 合并数据并入库
        const updatePost = this.userRepository.merge(user, {
            password: endPWD,
        });
        return this.userRepository.save(updatePost);
    }

    // 用户登出
    async LoginOut(post): Promise<{}> {
        const { account } = post;
        const user = await this.userRepository.findOne({ where: { account } });
        if (!user) {
            throw new HttpException('此账号不存在', 401);
        }
        return {};
    }
}
