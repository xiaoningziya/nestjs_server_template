import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from '@/db/redis-cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), RedisCacheModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
