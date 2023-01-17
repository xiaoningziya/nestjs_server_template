import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordUserDto {
    @ApiProperty({ description: '账号' })
    @IsNotEmpty({ message: '账号必填' })
    readonly account: string;

    @ApiProperty({ description: '旧密码' })
    @IsNotEmpty({ message: '原密码必填' })
    readonly old_password: string;

    @ApiProperty({ description: '新密码' })
    @IsNotEmpty({ message: '新密码必填' })
    readonly new_password: string;
}