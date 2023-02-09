import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CompareCodeDto {
    @ApiProperty({ description: '验证码Key' })
    @IsNotEmpty({ message: '验证码必填' })
    readonly VerificationKey: string;

    @ApiProperty({ description: '验证码Value' })
    @IsNotEmpty({ message: '验证码必填' })
    readonly VerificationCode: string;
}

export class LoginDto {
    @ApiProperty({ description: '账号' })
    @IsNotEmpty({ message: '账号必填' })
    readonly account: string;

    @ApiProperty({ description: '密码' })
    @IsNotEmpty({ message: '密码必填' })
    readonly password: string;
}
