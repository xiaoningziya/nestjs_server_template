import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from '../user/user.dot'
import { AuthService } from './auth.service'

@ApiTags('验证')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 账号密码登录
     */
    @ApiOperation({ summary: '登录' })
    // @UseGuards：使用守卫  @AuthGuard：认证守卫
    @UseGuards(AuthGuard('local')) 
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('login')
    async login(@Body() user: LoginUserDto, @Req() req) {
        console.log('login', user)
        return await this.authService.login(req.user);
    }


    /**
     * 微信扫码登录
     */
}