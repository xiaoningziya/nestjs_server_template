/**
 * @file 业务公用的dot类
 */

import { IsNotEmpty, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 分页实体类
export class DataListCommonDto {
    @ApiProperty({ description: '分页条数' })
    @IsNotEmpty({ message: '分页条数必填' })
    @Max(100, { message: '最多多分页100条数据' }) // 限制分页，避免数据被大量导出
    readonly pagesize: string;

    @ApiProperty({ description: '分页页数' })
    @IsNotEmpty({ message: '分页页数必填' })
    readonly pagenum: string;

    @ApiProperty({ description: '排序字段' })
    readonly order?: string;
}
