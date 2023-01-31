/**
 * @file 在service实现缓存的读写
 * 
 * @desc redis主要做了哪些功能?
 * 我们借助redis来实现token过期处理、token自动续期、以及用户唯一登录。
    - 过期处理：把用户信息及token放进redis，并设置过期时间
    - token自动续期：token的过期时间为30分钟，如果在这30分钟内没有操作，则重新登录，如果30分钟内有操作，就给token自动续一个新的时间，防止使用时掉线。
    - 户唯一登录：相同的账号，不同电脑登录，先登录的用户会被后登录的挤下线
 * @desc 为什么要使用redis来存token?
    1. 引入一个中间件管理token就避免了单点问题，对于分布式系统来说，不管你是哪一台服务处理的用户请求，我都是从redis获取的token。
    2. redis的响应速度非常快，如果不出现网络问题，基本上是毫秒级别相应。
    3. 对于token来说，是有时效性的，redis天然支持设置过期时间以及通过一些二方包提供的API到达自动续时效果。
 */

import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    // 存入指定缓存
    cacheSet(key: string, value: string, ttl: number) {
        this.cacheManager.set(key, value, { ttl }, (err) => {
            if (err) throw err;
        });
    }

    // 获取指定缓存
    async cacheGet(key: string): Promise<any> {
        return this.cacheManager.get(key);
    }

    // 清除指定缓存
    async cacheDel(key: string): Promise<any> {
        return this.cacheManager.del(key, (err) => {
            if (err) throw err;
        });
    }

    // 清空redis的缓存
    async cacheClear(key: string): Promise<any> {
        return this.cacheManager.reset();
    }
}
