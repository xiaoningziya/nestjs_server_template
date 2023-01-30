import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import dayjs from 'dayjs';

/**
 * @desc 此表配合redis完成一个合理的token存取过程
 * redis 用于<查>，然后验证
 * 登录表 用于记录用户登录状态，方便统计
 */
@Entity('user_token')
export class UserTokenEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 200 })
    uuid: string; // 此<uuid>使用<user>表中的主键

    @Column({ length: 200 })
    token: string;

    @Column({ length: 20 })
    account: string;

    @Column({ length: 20, default: '' })
    nickname: string;

    @Column({ default: dayjs().format('YYYY-MM-DD HH:mm:ss') })
    create_time: string;

    @Column({ default: dayjs().format('YYYY-MM-DD HH:mm:ss') })
    update_time: string;
}
