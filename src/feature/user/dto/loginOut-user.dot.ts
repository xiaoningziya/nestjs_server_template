import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class LoginOutUserDto {
    @ApiProperty({ description: '账号' })
    @IsNotEmpty({ message: '账号必填' })
    readonly account: string;
}