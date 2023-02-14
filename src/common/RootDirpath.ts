import { join } from 'path';

/**
 * @des 跟路径拼接，避免嵌套太深的文件夹过度使用../
 * @return /Users/.../nestjs_server_template/
 */
const RootDirPath = join(__dirname, '../../../');

export default RootDirPath;
