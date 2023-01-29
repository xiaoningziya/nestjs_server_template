import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsEntity } from './posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([PostsEntity])],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
