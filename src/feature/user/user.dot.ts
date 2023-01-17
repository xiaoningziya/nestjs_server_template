import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
    @ApiProperty({ description: '账号' })
    @IsNotEmpty({ message: '账号必填' })
    readonly account: string;

    @ApiProperty({ description: '密码' })
    @IsNotEmpty({ message: '密码必填' })
    readonly password: string;
}

export class LoginUserDto extends RegisterUserDto {
    // @ApiProperty({ description: '账号' })
    // @IsNotEmpty({ message: '账号必填' })
    // readonly account: string;

    // @ApiProperty({ description: '密码' })
    // @IsNotEmpty({ message: '密码必填' })
    // readonly password: string;
}

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

export class LoginOutUserDto {
    @ApiProperty({ description: '账号' })
    @IsNotEmpty({ message: '账号必填' })
    readonly account: string;
}