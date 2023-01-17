import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user") // 库表名称
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number; // 标记为主列，值自动生成

    @Column({ length: 20 })
    account: string;

    @Column({ length: 20 })
    password: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    create_time: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    update_time: Date;
}