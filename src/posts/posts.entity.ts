/**
 * @file <TypeORM>字段入库规则
 * @desc 遵从设计单一原则，此文件只对接数据库，不负责接口入参校验，为保证后期灵活性
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id: number; // 标记为主列，值自动生成

    @Column({ length: 50 })
    title: string;

    @Column({ length: 20 })
    author: string;

    @Column("text")
    content: string;

    @Column({ default: '' })
    thumb_url: string;

    @Column({ default: 1 })
    type: number

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    create_time: Date

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    update_time: Date
}