import { UserService, UserRo } from './user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RegisterUserDto } from './dto/register-user.dot'
import { LoginUserDto } from './dto/login-user.dot'
import { UpdatePasswordUserDto } from './dto/updatePassword-user.dot'
import { LoginOutUserDto } from './dto/loginOut-user.dot'

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
    async register(@Body() post: RegisterUserDto) {
        return await this.userService.Register(post)
    }

    /**
     * 用户登录
     * @param post
     */
    @ApiOperation({ summary: '用户注册' })
    @Post('login')
    async login(@Body() post: LoginUserDto) {
        return await this.userService.Login(post)
    }

    /**
     * 修改密码
     * @param post
     */
    @ApiOperation({ summary: '修改密码' })
    @Post('updatePassword')
    async updatePassword(@Body() post: UpdatePasswordUserDto) {
        return await this.userService.UpdatePassword(post)
    }

    /**
     * 用户登出
     * @param post
     */
    @ApiOperation({ summary: '用户登出' })
    @Post('loginOut')
    async loginOut(@Body() post: LoginOutUserDto) {
        return await this.userService.LoginOut(post)
    }
}