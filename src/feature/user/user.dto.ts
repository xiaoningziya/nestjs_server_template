import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataListCommonDto } from '@/common/CommonDto';

export class RegisterUserDto {
    @ApiProperty({ description: '账号' })
    @IsNotEmpty({ message: '账号必填' })
    readonly account: string;

    @ApiProperty({ description: '密码' })
    @IsNotEmpty({ message: '密码必填' })
    readonly password: string;
}

export class LoginUserDto {
    @ApiProperty({ description: '账号' })
    @IsNotEmpty({ message: '账号必填' })
    readonly account: string;

    @ApiProperty({ description: '密码' })
    @IsNotEmpty({ message: '密码必填' })
    readonly password: string;
}

export class UpdatePasswordUserDto {
    @ApiProperty({ description: '旧密码' })
    @IsNotEmpty({ message: '原密码必填' })
    readonly old_password: string;

    @ApiProperty({ description: '新密码' })
    @IsNotEmpty({ message: '新密码必填' })
    readonly new_password: string;
}

export class DeleteUserDto {
    @ApiProperty({ description: '用户id' })
    @IsNotEmpty({ message: '缺少用户id' })
    readonly id: string;
}

export class RecoverUserDto {
    @ApiProperty({ description: '用户id' })
    @IsNotEmpty({ message: '缺少用户id' })
    readonly id: string;
}

export class GetLoginUserDto {
    @ApiProperty({ description: 'pagesize' })
    @IsNotEmpty({ message: '缺少pagesize' })
    readonly pagesize: string;

    @ApiProperty({ description: 'pagenum' })
    @IsNotEmpty({ message: '缺少pagenum' })
    readonly pagenum: string;
}

export class OfflineUserDto {
    @ApiProperty({ description: '用户id' })
    @IsNotEmpty({ message: '缺少用户id' })
    readonly id: string;
}

export class SetNicknameDto {
    @ApiProperty({ description: '用户昵称' })
    @IsNotEmpty({ message: '缺少用户昵称' })
    @MaxLength(10, { message: '昵称最大长度10位' })
    @MinLength(2, { message: '昵称最小长度2位' })
    readonly nickname: string;
}

export class SetAvatarDto {
    @ApiProperty({ description: '头像地址' })
    @IsNotEmpty({ message: '缺少图片地址' })
    readonly url: string;
}

export class GetUserListUserDto extends DataListCommonDto {}
