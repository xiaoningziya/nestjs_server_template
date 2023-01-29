/**
 * @file 全局公用加盐方法
 * @desc 主要包含（密码加密、密码比较......）
 */

// import bcryptjs from 'bcryptjs'

/**
 * 加密处理 - 同步方法
 * bcryptjs.hashSync(data, salt)
 *    - data  要加密的数据
 *    - slat  用于哈希密码的盐。如果指定为数字，则将使用指定的轮数生成盐并将其使用。推荐 10
 */

// const hashPassword = bcryptjs.hashSync(password, 10)

/**
 * 校验 - 使用同步方法
 * bcryptjs.compareSync(data, encrypted)
 *    - data        要比较的数据, 使用登录时传递过来的密码
 *    - encrypted   要比较的数据, 使用从数据库中查询出来的加密过的密码
 */
//  const isOk = bcryptjs.compareSync(password, encryptPassword)
