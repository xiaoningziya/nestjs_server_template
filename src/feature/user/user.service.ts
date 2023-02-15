import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { RedisCacheService } from '@/redis/redis-cache.service';
import { UserTokenEntity } from '@/feature/auth/auth.entity';
var bcrypt = require('bcryptjs');
import * as REDIS from '@/constant/RedisKeyPrefix';
import fs from 'fs';
import path from 'path';
import RootDirpath from '@/common/RootDirpath';
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
        this.redisCacheService.cacheDel(
            `${REDIS.RedisPrefixToken}${id}&${account}`,
        );
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
        this.redisCacheService.cacheDel(
            `${REDIS.RedisPrefixToken}${id}&${account}`,
        );
        return {};
    }

    // 创建用户假数据
    async mockData() {
        const len = 50000;
        const phoneNum = 18210249690;
        for (let i = 0; i < len; i++) {
            const new_user = {
                account: String(phoneNum * 1 + i * 1),
                password: '182',
            };
            const user = await this.userRepository.findOne({
                where: { account: new_user.account },
            });
            if (user) return;
            const newUser = await this.userRepository.create(new_user);
            await this.userRepository.save(newUser);
        }
    }

    // 获取用户列表(分页)
    async GetUserList(post) {
        const { pagenum = 1, pagesize = 10, keyword } = post;
        const qb = this.userRepository.createQueryBuilder('user'); // qb实体
        qb.withDeleted(); // 指示是否应在实体结果中包含软删除的行
        // 如果有关键字，进行账号模糊查询
        if (keyword) {
            qb.where({
                account: Like(`%${keyword}%`),
            });
        }
        // 定义要返回的字段
        qb.select([
            'user.id',
            'user.account',
            'user.nickname',
            'user.avatar',
            'user.create_time',
            'user.update_time',
            'user.delete_time',
        ]); // 需要的属性
        // qb.where("user.id = :id", { id: 1 }) // 条件语句
        qb.orderBy('user.create_time', 'ASC'); // @arguments[1]: 'ASC' 升序 'DESC' 降序
        const count = await qb.getCount(); // 查总数
        qb.offset(pagesize * (pagenum - 1)); // 偏移位置
        qb.limit(pagesize); // 条数
        // .skip(5)     // 可选：跳过多少条
        // .take(10)    // 可选：拿多少条
        const list = await qb.getMany(); // getMany() 获取所有用户
        return {
            list,
            count,
        };
    }

    // 拉黑单个用户
    async DeleteUser(post) {
        const { id } = post;
        const item = await this.userRepository.findOne({
            where: { id } as any,
            withDeleted: true, // 指示是否应在实体结果中包含软删除的行
        });
        console.log('item', item);
        if (item) {
            await this.userRepository.softRemove(item);
            return {};
        } else {
            throw new HttpException('用户不存在', 200);
        }
    }

    // 恢复单个用户
    async RecoverUser(post) {
        const { id } = post;
        const item = await this.userRepository.findOne({
            where: { id } as any,
            withDeleted: true,
        });
        if (item) {
            await this.userRepository.recover(item);
            return {};
        } else {
            throw new HttpException('用户不存在', 200);
        }
    }

    // 查询登录表用户(分页) Mysql
    async GetLoginUser(post) {
        const { pagenum = 1, pagesize = 10 } = post;
        const qb = this.UserTokenRepository.createQueryBuilder('user'); // qb实体
        qb.select([
            'user.id',
            'user.uuid',
            'user.token',
            'user.account',
            'user.nickname',
            'user.create_time',
            'user.update_time',
        ]); // 需要的属性
        qb.orderBy('user.create_time', 'ASC'); // @arguments[1]: 'ASC' 升序 'DESC' 降序
        const count = await qb.getCount(); // 查总数
        qb.offset(pagesize * (pagenum - 1)); // 偏移位置
        qb.limit(pagesize); // 条数
        const list = await qb.getMany(); // getMany() 获取所有用户
        return {
            list,
            count,
        };
    }

    // 查询登录表用户 Redis
    async GetCatchLoginUser(post) {
        const arr = await this.redisCacheService.cacheStoreKeys();
        const keys = arr.filter(
            (item) => item.indexOf(REDIS.RedisPrefixToken) > -1,
        );
        if (keys?.length) {
            let datas = [];
            for (let i = 0; i < keys.length; i++) {
                const val = await this.redisCacheService.cacheGet(keys[i]);
                if (val) {
                    let noPrefix = keys[i].split(REDIS.RedisPrefixToken)[1]; // 不包含前缀的值
                    datas.push({
                        KEY: keys[i],
                        VALUE: val,
                        uuid: noPrefix.split('&')[0],
                        account: noPrefix.split('&')[1],
                        token: val,
                    });
                }
            }
            return {
                list: datas,
                count: datas.length,
            };
        }
        return {};
    }

    // 查询图片验证码 Redis
    async GetCapcodeList(post) {
        const arr = await this.redisCacheService.cacheStoreKeys();
        const keys = arr.filter(
            (item) => item.indexOf(REDIS.RedisPrefixCaptcha) > -1,
        );
        if (keys?.length) {
            let datas = [];
            for (let i = 0; i < keys.length; i++) {
                const val = await this.redisCacheService.cacheGet(keys[i]);
                if (val) {
                    let noPrefix = keys[i].split(REDIS.RedisPrefixToken)[1]; // 不包含前缀的值
                    datas.push({
                        KEY: keys[i],
                        VALUE: val,
                    });
                }
            }
            return {
                list: datas,
                count: datas.length,
            };
        }
        return {};
    }

    // 下线单个用户
    async OfflineUser(post) {
        const { id, account } = post;
        // 查找登录表里的用户
        const findRow = await this.UserTokenRepository.findOne({
            where: { uuid: id },
        });
        if (findRow) {
            // 删除登录表中的用户
            await this.UserTokenRepository.remove(findRow);
            // 清除redis缓存里的用户
            this.redisCacheService.cacheDel(
                `${REDIS.RedisPrefixToken}${id}&${account}`,
            );
            return {};
        } else {
            throw new HttpException('用户不存在', 200);
        }
    }

    // 下线所有用户
    async OfflineAllUser(post) {
        const qb = this.UserTokenRepository.createQueryBuilder('user'); // qb实体
        // 清空 登录表
        qb.delete().execute();
        // // 清空 redis
        // this.redisCacheService.cacheClear();
        // return {};
        const arr = await this.redisCacheService.cacheStoreKeys();
        const keys = arr.filter(
            (item) => item.indexOf(REDIS.RedisPrefixToken) > -1,
        );
        if (keys?.length) {
            for (let i = 0; i < keys.length; i++) {
                this.redisCacheService.cacheDel(keys[i]);
            }
        }
        return {};
    }

    // 清空图片验证码
    async ClearCapcodeList(post) {
        const qb = this.UserTokenRepository.createQueryBuilder('user'); // qb实体
        // // 清空 redis
        const arr = await this.redisCacheService.cacheStoreKeys();
        const keys = arr.filter(
            (item) => item.indexOf(REDIS.RedisPrefixCaptcha) > -1,
        );
        if (keys?.length) {
            for (let i = 0; i < keys.length; i++) {
                this.redisCacheService.cacheDel(keys[i]);
            }
        }
        return {};
    }

    // 用户设置昵称
    async UpdateNickname(post, userInfo) {
        const { id } = userInfo;
        const { nickname } = post;
        const user = await this.userRepository.findOne({ where: { id } });
        if (user && nickname) {
            const updatePost = this.userRepository.merge(user, {
                nickname: nickname,
            });
            await this.userRepository.save(updatePost);
            const findUser = await this.userRepository.findOne({
                where: { id },
            });
            return {
                userInfo: {
                    account: findUser.account,
                    avatar: findUser.avatar,
                    nickname: findUser.nickname,
                    id: findUser.id,
                },
            };
        } else {
            return {};
        }
    }

    // 用户设置头像
    async UpdateAvatar(post, userInfo) {
        const { id } = userInfo;
        const { url } = post;
        const user = await this.userRepository.findOne({ where: { id } });
        if (user && url) {
            const updatePost = this.userRepository.merge(user, {
                avatar: url,
            });
            await this.userRepository.save(updatePost);
            const findUser = await this.userRepository.findOne({
                where: { id },
            });
            return {
                userInfo: {
                    account: findUser.account,
                    avatar: findUser.avatar,
                    nickname: findUser.nickname,
                    id: findUser.id,
                },
            };
        } else {
            return {};
        }
    }

    async ExportExcel(post, userInfo) {
        // 解构前端入参
        const { pagenum = 1, pagesize = 10, keyword } = post;
        const qb = this.userRepository.createQueryBuilder('user'); // qb实体
        qb.withDeleted(); // 指示是否应在实体结果中包含软删除的行
        // 如果有关键字，进行账号模糊查询
        if (keyword) {
            qb.where({
                account: Like(`%${keyword}%`),
            });
        }
        // 定义要返回的字段
        qb.select([
            'user.id',
            'user.account',
            'user.nickname',
            'user.avatar',
            'user.create_time',
            'user.update_time',
        ]); // 需要的属性=
        qb.orderBy('user.create_time', 'ASC'); // @arguments[1]: 'ASC' 升序 'DESC' 降序
        qb.skip(pagesize * (pagenum - 1)); // 跳过多少条
        qb.take(pagesize); // 拿多少条
        // result是通过前端传递的参数从数据库获取需要导出的信息
        const result = await qb.getMany(); // getMany() 获取所有用户
        const workbook = new ExcelJS.Workbook();
        // 设置 Excel 的 sheet
        const worksheet = workbook.addWorksheet('【 用户注册表数据 】');
        // 定义表头名称和字段名
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 42 },
            { header: '账号', key: 'account', width: 25 },
            { header: '昵称', key: 'nickname', width: 25 },
            { header: '头像', key: 'avatar', width: 50 },
            { header: '注册时间', key: 'create_time', width: 25 },
            { header: '更新时间', key: 'update_time', width: 25 },
        ];
        worksheet.addRows(result);
        // 针对头像列each循环 修改样式
        const AvatarColumn = worksheet.getColumn('avatar');
        AvatarColumn.eachCell((item) => {
            item.style.font = {
                italic: true, // 斜体
                underline: 'single', // 下划线 单条
                color: {
                    // argb: 'be14807f', // 字体颜色
                    theme: 3,
                },
            };
            item.value = {
                text: item.value as string, // 设置 value
                hyperlink: item.value as string, // 设置 link
            };
        });
        // 获取第一行
        const FirstRow = worksheet.getRow(1);
        FirstRow.height = 28; // 第一行高度
        FirstRow.font = {
            size: 18, // 字体大小
            bold: true, // 加粗
            // 字体颜色 argb和theme二选一即可
            color: {
                // argb: 'be14807f'
                theme: 5, // 0白 1黑 2灰 3蓝 5红
            },
        };
        const content = await workbook.xlsx.writeBuffer();
        return {
            filename: '用户注册表导出--' + new Date().getTime(),
            content, // 前端接受到的数据格式为{type: 'buffer', data: []}
        };
    }
}
