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
import * as UserDOT from './user.dto';
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
    @Post('updatePassword')
    async updatePassword(
        @Body() post: UserDOT.UpdatePasswordUserDto,
        @Req() req,
    ) {
        const userInfo = req.user; // 拿到请求的用户信息
        return await this.userService.UpdatePassword(post, userInfo);
    }

    /**
     * 退出登录
     * @param post
     */
    @ApiOperation({ summary: '退出登录' })
    @Post('loginOut')
    // 这里不接收参数，无需dot
    async loginOut(@Body() post: {}, @Req() req) {
        const userInfo = req.user; // 拿到请求的用户信息
        return await this.userService.LoginOut(post, userInfo);
    }

    /**
     * 获取用户列表
     * @param post
     */
    @ApiOperation({ summary: '获取用户列表' })
    @Post('getUserList')
    async getUserList(@Body() post: UserDOT.GetUserListUserDto, @Req() req) {
        return await this.userService.GetUserList(post);
    }

    /**
     * 删除单个用户(拉黑)
     * @param post
     */
    @ApiOperation({ summary: '删除单个用户(拉黑)' })
    @Post('deleteUser')
    async deleteUser(@Body() post: UserDOT.DeleteUserDto, @Req() req) {
        return await this.userService.DeleteUser(post);
    }

    /**
     * 恢复单个用户
     * @param post
     */
    @ApiOperation({ summary: '恢复单个用户' })
    @Post('recoverUser')
    async recoverUser(@Body() post: UserDOT.RecoverUserDto, @Req() req) {
        return await this.userService.RecoverUser(post);
    }

    /**
     * 查询登录表用户(分页) Mysql
     * @param post
     */
    @ApiOperation({ summary: '查询登录表用户(分页) Mysql' })
    @Post('getLoginUser')
    async getLoginUser(@Body() post: UserDOT.GetLoginUserDto, @Req() req) {
        return await this.userService.GetLoginUser(post);
    }

    /**
     * 查询登录表用户 Redis
     * @param post
     */
    @ApiOperation({ summary: '查询登录表用户 Redis' })
    @Post('getCatchLoginUser')
    async getCatchLoginUser(@Body() post: {}, @Req() req) {
        return await this.userService.GetCatchLoginUser(post);
    }

    /**
     * 查询验证码列表 Redis
     * @param post
     */
    @ApiOperation({ summary: '查询验证码列表 Redis' })
    @Post('getCapcodeList')
    async getCapcodeList(@Body() post: {}, @Req() req) {
        return await this.userService.GetCapcodeList(post);
    }

    /**
     * 清空验证码列表 Redis
     * @param post
     */
    @ApiOperation({ summary: '清空验证码列表 Redis' })
    @Post('clearCapcodeList')
    async clearCapcodeList(@Body() post: {}, @Req() req) {
        return await this.userService.ClearCapcodeList(post);
    }

    /**
     * 下线单个用户
     * @param post
     */
    @ApiOperation({ summary: '下线单个用户' })
    @Post('offlineUser')
    async offlineUser(@Body() post: UserDOT.OfflineUserDto, @Req() req) {
        return await this.userService.OfflineUser(post);
    }

    /**
     * 下线所有用户
     * @param post
     */
    @ApiOperation({ summary: '下线所有用户' })
    @Post('offlineAllUser')
    async offlineAllUser(@Body() post: {}, @Req() req) {
        return await this.userService.OfflineAllUser(post);
    }

    /**
     * 用户设置昵称
     * @param post
     */
    @ApiOperation({ summary: '用户设置昵称' })
    @Post('updateNickname')
    async updateNickname(@Body() post: UserDOT.SetNicknameDto, @Req() req) {
        const userInfo = req.user; // 拿到请求的用户信息
        return await this.userService.UpdateNickname(post, userInfo);
    }

    /**
     * 用户设置头像
     * @param post
     */
    @ApiOperation({ summary: '用户设置头像' })
    @Post('updateAvatar')
    async updateAvatar(@Body() post: UserDOT.SetAvatarDto, @Req() req) {
        const userInfo = req.user; // 拿到请求的用户信息
        return await this.userService.UpdateAvatar(post, userInfo);
    }

    /**
     * 导出 用户表当前页数据
     * @param post
     */
    @ApiOperation({ summary: '导出 用户表当前页数据' })
    @Post('exportExcel')
    async exportExcel(@Body() post: UserDOT.GetUserListUserDto, @Req() req) {
        const userInfo = req.user; // 拿到请求的用户信息
        return await this.userService.ExportExcel(post, userInfo);
    }
}
