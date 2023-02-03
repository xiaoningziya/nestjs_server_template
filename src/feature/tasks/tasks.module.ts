import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';

import { UserModule } from '@/feature/user/user.module';
@Module({
    imports: [UserModule],
    providers: [TasksService],
})
export class TasksModule {}
