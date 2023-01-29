/**
 * @file 账号密码本地认证
 * 标记了@UseGuards(AuthGuard('local'))的控制器会执行
 */

import { compareSync } from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UserEntity } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    // 如果不是username、password， 在constructor中配置
    super({
      // key 必须是 usernameField 和 passwordField
      usernameField: 'account',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(account: string, password: string) {
    console.log('local', account, password)
    // 因为密码是加密后的，没办法直接对比用户名密码，只能先根据用户名查出用户，再比对密码
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.account=:account', { account })
      .getOne();

    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误！');
    }

    return user;
  }
}
