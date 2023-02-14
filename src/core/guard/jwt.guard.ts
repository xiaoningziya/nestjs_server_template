/**
 * @desc 将AuthGuard('jwt')单个接口守卫升级为当前类
 * 实现全局注册鉴权守卫
 */

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as ApiWriteList from '@/constant/ApiWriteList';

export class JwtAuthGuard extends AuthGuard('jwt') {
    public requestUrl: string = '';
    constructor() {
        super();
    }
    getRequest(context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        this.requestUrl = request.url;
        return request;
    }

    handleRequest<User>(err, user: User): User {
        // 判断：当前接口是否需要跳过全局JWT鉴权守卫
        if (ApiWriteList.JWT_IGNORE_LIST.includes(this.requestUrl)) {
            return {} as User;
        }
        if (err || !user) {
            throw new UnauthorizedException('身份验证失败');
        }
        return user;
    }
}
