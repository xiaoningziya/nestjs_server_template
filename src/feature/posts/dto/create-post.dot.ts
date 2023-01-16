/**
 * DTO层 (Data Transfer Object) 
 * 我们使用pipe的时候我们必须使用class，因为interface会在运行时中被置换，而导致我们无法引用它
 * @file 验证接口入参
 * @desc <DTO>本身是不存在任何验证功能， 但是我们可以借助<class-validator>来让DTO可以验证数据
 * 
 */

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatePostDto {
    @ApiProperty({ description: '文章标题' })
    @IsNotEmpty({ message: '文章标题必填' })
    readonly title: string;

    @ApiProperty({ description: '文章作者' })
    @IsNotEmpty({ message: '缺少作者信息' })
    readonly author: string;

    @ApiProperty({ description: '文章内容' })
    readonly content: string;

    @ApiPropertyOptional({ description: '文章封面' })
    readonly cover_url: string;

    @ApiProperty({ description: '文章类型' })
    // @IsNumber()
    readonly type: number;
}