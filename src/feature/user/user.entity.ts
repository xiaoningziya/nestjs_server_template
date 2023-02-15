import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
var bcrypt = require('bcryptjs');

@Entity('user') // 库表名称
export class UserEntity {
    // 使用@PrimaryGeneratedColumn('uuid')创建一个主列id，该值将使用uuid自动生成。 Uuid 是一个独特的字符串
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 20 })
    account: string;

    @Exclude()
    @Column({
        length: 100,
        // select: false // 表示隐藏此列 和@Exclude二选一
    })
    password: string;

    @Column({ length: 20, default: 'User' })
    nickname: string;

    @Column({ default: 'http://172.16.1.165:3001/static/default.png' })
    avatar: string;

    @CreateDateColumn({
        type: 'timestamp',
        comment: '创建时间',
    })
    create_time: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        comment: '更新时间',
    })
    update_time: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        comment: '删除时间',
    })
    delete_time: Date;

    /**
     * @func 在密码入库前加密替换
     * @desc <注册 修改密码> 会执行此逻辑
     */
    @BeforeInsert()
    async encryptPwd() {
        var salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hashSync(this.password, salt);
    }
}
