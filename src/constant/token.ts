/**
 * @file token相关常量
 */

// 登录时生成token存入redis设置的过期时间
export const TOKEN_FIRST_SET_TIME: number = 1800;
// 验证码存入redis设置的过期时间
export const CAPCODE_FIRST_SET_TIME: number = 180;
// 有效期内接收请求token自动续期有效时长
export const TOKEN_AUTOMATIC_RENEWAL_TIME: number = 1800;
// token自动续期逻辑的忽略名单
export const TOKEN_AUTOMATIC_RENEWAL_IGNORE_LIST: Array<string> = [
    '/api/user/loginOut',
];
