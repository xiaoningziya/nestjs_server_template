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
import { RedisCacheService } from '@/db/redis-cache.service';
import * as REDIS from '@/constant/redis';
import * as CONST from '@/constant/token';

@ApiTags('AUTH 认证')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly toolsCaptcha: ToolsCaptcha,
        private redisCacheService: RedisCacheService,
    ) {}

    /**
     * 获取图片验证码
     */
    @ApiOperation({ summary: '获取图片验证码' })
    @Get('authcode') // 当请求该接口时，返回一张随机图片验证码
    async getCode(@Req() req, @Res() res) {
        const svgCaptcha = await this.toolsCaptcha.captche(); // 创建验证码
        console.log('创建验证码', svgCaptcha);
        this.redisCacheService.cacheSet(
            `${REDIS.RedisPrefixCaptcha}${svgCaptcha.text}`,
            '图片验证码',
            CONST.CAPCODE_FIRST_SET_TIME,
        );
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
    async login(@Body() post, @Req() req) {
        // console.log('===', user, req);
        // const userInfo = req.user;
        return await this.authService.login(post, req.user);
    }

    /**
     * 微信扫码登录
     */
}
