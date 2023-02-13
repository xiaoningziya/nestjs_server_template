import { join } from 'path';

/**
 * @des 跟路径拼接，避免嵌套太深的文件夹过渡使用../
 * @return /Users/ningyanzhe/Desktop/PublicProject/nestjs_server_template/
 */
const RootDirname = join(__dirname, '../../../');

export default RootDirname;
