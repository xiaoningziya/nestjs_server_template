import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/user.dot';
import { AuthService } from './auth.service';
import { ToolsCaptcha } from '@/common/captcha';

@ApiTags('AUTH 认证')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly toolsCaptcha: ToolsCaptcha,
    ) {}

    /**
     * 获取图片验证码
     */
    @ApiOperation({ summary: '获取图片验证码' })
    @Get('authcode') // 当请求该接口时，返回一张随机图片验证码
    async getCode(@Req() req, @Res() res) {
        const svgCaptcha = await this.toolsCaptcha.captche(); // 创建验证码
        // req.session.code = svgCaptcha.text; // 使用session保存验证，用于登陆时验证
        res.type('image/svg+xml'); // 指定返回的类型
        res.send(svgCaptcha.data); // 给页面返回一张图片
    }

    /**
     * 账号密码登录
     */
    @ApiOperation({ summary: '认证登录' })
    // @UseGuards：使用守卫  @AuthGuard：认证守卫
    @UseGuards(AuthGuard('local'))
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('login')
    async login(@Body() user: LoginUserDto, @Req() req) {
        const userInfo = req.user;
        return await this.authService.login(req.user, userInfo);
    }

    /**
     * 微信扫码登录
     */
}
