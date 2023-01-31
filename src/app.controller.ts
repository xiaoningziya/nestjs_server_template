import { Controller, Get, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('顶级路由：/api')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('default') // 前台 访问：/api/default
    @Render('default/index') // 使用render渲染模板引擎，参数就是 /views 文件夹下的 index.ejs
    defaultIndex() {
        return {
            // 只有返回参数在模板才能获取，如果不传递参数，必须返回一个空对象
            msg: '欢迎访问<default>前台页面',
        };
    }

    @Get('admin') // 后台 访问：/api/admin
    @Render('admin/index') // 使用render渲染模板引擎，参数就是 /views 文件夹下的 index.ejs
    adminIndex() {
        return {
            // 只有返回参数在模板才能获取，如果不传递参数，必须返回一个空对象
            msg: '欢迎访问<admin>后台页面',
        };
    }
}
