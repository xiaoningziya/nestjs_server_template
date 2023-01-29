/**
 * @file 在service实现缓存的读写
 * 
 * @desc redis主要做了哪些功能：
 * 我们借助redis来实现token过期处理、token自动续期、以及用户唯一登录。
    - 过期处理：把用户信息及token放进redis，并设置过期时间
    - token自动续期：token的过期时间为30分钟，如果在这30分钟内没有操作，则重新登录，如果30分钟内有操作，就给token自动续一个新的时间，防止使用时掉线。
    - 户唯一登录：相同的账号，不同电脑登录，先登录的用户会被后登录的挤下线
 */

import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    cacheSet(key: string, value: string, ttl: number) {
        this.cacheManager.set(key, value, { ttl }, (err) => {
            if (err) throw err;
        });
    }

    async cacheGet(key: string): Promise<any> {
        return this.cacheManager.get(key);
    }
}
