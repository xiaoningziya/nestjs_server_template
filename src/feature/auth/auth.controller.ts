import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RedisCacheService } from '@/redis/redis-cache.service';
import * as AuthDOT from './auth.dto';

@ApiTags('AUTH 认证')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private redisCacheService: RedisCacheService,
    ) {}

    /**
     * 获取图片验证码
     */
    @ApiOperation({ summary: '获取图片验证码' })
    @Post('authcode') // 当请求该接口时，返回一张随机图片验证码
    async getCode(@Body() post) {
        // req.session.code = svgCaptcha.text; // 使用session保存验证，用于登陆时验证
        // res.type('image/svg+xml'); // 指定返回的类型
        // res.send(svgCaptcha.data); // 给页面返回一张图片
        return await this.authService.GetCode(post);
    }

    /**
     * 验证图片验证码
     */
    @ApiOperation({ summary: '验证图片验证码' })
    @Post('comparecode')
    async compareCode(@Body() post: AuthDOT.CompareCodeDto) {
        return await this.authService.CompareCode(post);
    }

    /**
     * 账号密码登录
     */
    @ApiOperation({ summary: '认证登录' })
    // @UseGuards：使用守卫  @AuthGuard：认证守卫
    @UseGuards(AuthGuard('local'))
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('login')
    async login(@Body() post: AuthDOT.LoginDto, @Req() req) {
        // console.log('===', user, req);
        // const userInfo = req.user;
        return await this.authService.login(post, req.user);
    }

    /**
     * 微信扫码登录
     */
}
