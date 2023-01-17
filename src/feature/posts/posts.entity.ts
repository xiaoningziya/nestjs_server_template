/**
 * @file <TypeORM>字段入库规则
 * @desc 遵从设计单一原则，此文件只对接数据库，不负责接口入参校验，为保证后期灵活性
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// import { PostInfoDto } from './dto/create-post.dot';

@Entity("posts")
export class PostsEntity {
    @PrimaryGeneratedColumn() // 标记为主列，值自动生成
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column({ length: 20 })
    author: string;

    // 作者
    // @ManyToOne((type) => User, (user) => user.nickname)
    // author: User;

    @Column("text")
    content: string;

    @Column("text")
    coverUrl: string;

    @Column({ default: '' })
    thumb_url: string;

    @Column({ default: 1 })
    type: number

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    create_time: Date

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    update_time: Date

    // toResponseObject(): PostInfoDto {
    //     let responseObj: PostInfoDto = {
    //       ...this,
    //       isRecommend: this.isRecommend ? true : false,
    //     };
    //     if (this.category) {
    //       responseObj.category = this.category.name;
    //     }
    //     return responseObj;
    // }
}
