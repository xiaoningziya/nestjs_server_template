import { UserService, UserRo } from './user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RegisterUserDto } from './dto/register-user.dot'

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
    async create(@Body() post: RegisterUserDto) {
        return await this.userService.Register(post)
    }
}