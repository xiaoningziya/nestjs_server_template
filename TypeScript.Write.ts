/**
 * @file 背写官方提供的类型
 */

/**
 * 类型守卫 4个
 * typeof   基本类型检测
 * instanceof   复杂类型检测
 * in   检测子集
 * is   类型谓词
 */
// 1. typeof
function isNumber(value: any): boolean {
    if (typeof value === 'number') return true;
    return false;
}
let isNum01 = isNumber(12);
let isNum02 = isNumber('abc');
// 2. instanceof
function createDate(value: Date | string): Date {
    if (value instanceof Date) return value;
    return createDate(value);
}
let CD01 = createDate('2022-02-02');
let CD02 = createDate(new Date());
// 3. in
interface IValX {
    name: string;
    x: number;
}
interface IValY {
    name: string;
    y: number;
}
function getValue(value: IValX | IValY): number {
    if ('x' in value) return value.x;
    if ('y' in value) return value.y;
}
// 4. is
function isString(value: any): value is string {
    return typeof value === 'string';
}

/**
 * 泛型工具类型 5个
 * typeof   提取数据的类型
 * keyof    取出对象的所有key
 * in   循环联合类型
 * extends  继承能力
 * infer    提取类型
 */
// 1. typeof
let todo = {
    id: 109,
    des: '描述',
};
function todoFn(value: typeof todo) {}
let td01 = todoFn(todo);
// 2. keyof
interface IUser {
    name: string;
    age: number;
}
type KeyType = keyof IUser;
function testKey(value: KeyType) {}
let TK01 = testKey('name');
let TK02 = testKey('age');
let TK03 = testKey('other'); // 报错，类型不匹配
// 3. in
interface Point {
    x: number;
    y: number;
}
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};
let p2: MyReadonly<Point> = { x: 10, y: 20 };
p2.x = 30; // 报错：因为是只读
// 4. extends
interface ILen {
    length: number;
}
function getLength<T extends ILen>(value: T): number {
    return value.length;
}
let GL01 = getLength({ length: 100, count: 333 });
// 5. infer
type MyReturnType<T> = T extends (...arg: any[]) => infer R ? R : never;
let RT01: MyReturnType<(a, b) => number>;
let RT02: MyReturnType<(a, b) => boolean | string>;

/**
 * 泛型内置类型 12个
 * Required     子集转换为必填         对象类型——格式参数
 * Partial      子集转换为可选         对象类型——格式参数
 * Exclude      T中去除U的属性并返回    联合类型——格式参数
 * Extract      T中查找U的属性并返回    联合类型——格式参数
 * Omit         T中去除U的属性并返回    对象类型——格式参数
 * Pick         T中查找U的属性并返回    对象类型——格式参数
 * Readonly     子集转换为只读         对象类型——格式参数
 * NonNullable  去除null和undefined   联合类型——格式参数
 * Record       包装返回新类型         联合类型——格式参数
 * Parameters   获取函数参数类型元组集合    函数——格式参数
 * ReturnType   获取返回值类型         函数——格式参数
 * InstanceType 获取实例原型           类——格式参数
 */
// 1. Required
interface PersonA {
    name?: string;
    age?: number;
}
let p01: Required<PersonA> = {}; // 报错：所以属性为必填
// 2. Partial
interface PersonB {
    name: string;
    age: number;
}
let p02: Partial<PersonB> = {}; // 正常运行
// 3. Exclude
type TypeA = 'name' | 'age' | 'id';
type TypeB = 'sex' | 'age';
type TypeC = Exclude<TypeA, TypeB>; // 'name' | 'id'
// 4. Extract
type TypeD = 'name' | 'age' | 'id';
type TypeE = 'sex' | 'age';
type TypeF = Extract<TypeA, TypeB>; // 'age'
// 5. Omit
type TOA = {
    id: number;
    name: string;
    age: number;
    sex: string;
};
type TOB = {
    id: number;
    age: number;
};
type TOC = Omit<TOA, keyof TOB>; // {name: string;sex: string;}
// 6. Pick
type TPA = {
    id: number;
    name: string;
    age: number;
    sex: string;
};
type TPB = {
    id: number;
    age: number;
};
type TPC = Pick<TPA, keyof TPB>; // {age: number;id: number;}
// 7. Readonly
type TRA = {
    id: number;
    name: string;
};
let TR01: Readonly<TRA> = { id: 97, name: 'zs' };
TR01.id = 98; // 只读
// 8. NonNullable
type TNA = string | number | null | undefined | Function | boolean;
type TNB = NonNullable<TNA>; // string | number | boolean | Function
// 9. Record
type TRD = 'key' | 'value' | 'id';
type StringRecord = Record<TRD, string>;
let trd01: StringRecord = { key: 'name', value: '文本', id: '97' }; // 正确编译
let trd02: StringRecord = { key: 'name', value: '文本', id: 97 }; // 类型错误
// 10. Parameters
type TPQ = (name: string, id: number) => number;
type TPT = Parameters<TPQ>; // [name: string, id: number]
let tp100: TPT = ['abc', 97]; // 正确编译
let tp101: TPT = ['abc', 'def']; // 类型错误
// 11. ReturnType
let RT80: ReturnType<() => number> = 12; // 正确编译
let RT81: ReturnType<() => string> = 'abc'; // 正确编译
let RT82: ReturnType<() => string> = 12; // 类型报错
// 12. InstanceType
class CUserA {}
type TC = InstanceType<typeof CUserA>; // CUserA
