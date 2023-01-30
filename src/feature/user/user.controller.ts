import { UserService, UserRo } from './user.service';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as UserDOT from './user.dot';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('用户系列接口：/api/user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '获取用户信息' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt')) // 此项表示该接口需要Auth认证
    @Get()
    async getUserInfo(@Req() req) {
        return req.user;
    }

    /**
     * 用户注册
     * @param post
     */
    @UseInterceptors(ClassSerializerInterceptor) // 接口返回数据时过滤掉使用 @Exclude 标记的列
    @ApiOperation({ summary: '用户注册' })
    @Post('register')
    async register(@Body() post: UserDOT.RegisterUserDto) {
        return await this.userService.Register(post);
    }

    /**
     * 修改密码
     * @param post
     */
    @ApiOperation({ summary: '修改密码' })
    @UseGuards(AuthGuard('jwt'))
    @Post('updatePassword')
    async updatePassword(
        @Body() post: UserDOT.UpdatePasswordUserDto,
        @Req() req,
    ) {
        const userInfo = req.user; // 拿到请求的用户信息
        return await this.userService.UpdatePassword(post, userInfo);
    }

    /**
     * 用户登出
     * @param post
     */
    @ApiOperation({ summary: '用户登出' })
    @UseGuards(AuthGuard('jwt'))
    @Post('loginOut')
    // 这里不接收参数，无需dot
    async loginOut(@Body() post: {}, @Req() req) {
        const userInfo = req.user; // 拿到请求的用户信息
        return await this.userService.LoginOut(post, userInfo);
    }
}
