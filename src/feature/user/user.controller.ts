import { UserService, UserRo } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import * as UserDOT from './user.dot'

@ApiTags('用户系列接口：/api/user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * 用户注册
     * @param post
     */
    @ApiOperation({ summary: '用户注册' })
    @Post('register')
    async register(@Body() post: UserDOT.RegisterUserDto) {
        return await this.userService.Register(post)
    }

    /**
     * 用户登录
     * @param post
     */
    @ApiOperation({ summary: '用户登录' })
    @Post('login')
    async login(@Body() post: UserDOT.LoginUserDto) {
        return await this.userService.Login(post)
    }

    /**
     * 修改密码
     * @param post
     */
    @ApiOperation({ summary: '修改密码' })
    @Post('updatePassword')
    async updatePassword(@Body() post: UserDOT.UpdatePasswordUserDto) {
        return await this.userService.UpdatePassword(post)
    }

    /**
     * 用户登出
     * @param post
     */
    @ApiOperation({ summary: '用户登出' })
    @Post('loginOut')
    async loginOut(@Body() post: UserDOT.LoginOutUserDto) {
        return await this.userService.LoginOut(post)
    }
}