import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    /**
     * @desc 下方装饰器详解
     * 
        * * * * * * 分别对应的意思：
        第1个星：秒
        第2个星：分钟
        第3个星：小时
        第4个星：一个月中的第几天
        第5个星：月
        第6个星：一个星期中的第几天

        如：
        45 * * * * *：每隔45秒执行一次
   */
    @Cron('45 * * * * *') // 每隔45秒执行一次
    handleCron() {
        this.logger.debug('定时任务--日志--45秒');
    }

    @Interval(200000) // 每隔200秒执行一次
    handleInterval() {
        this.logger.debug('定时任务--日志--200秒');
    }

    @Timeout(5000) // 5秒后，只执行一次
    handleTimeout() {
        this.logger.debug('定时任务--单次--日志--5秒');
    }
}
