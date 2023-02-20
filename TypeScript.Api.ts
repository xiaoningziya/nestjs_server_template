/**
 * @file TS 核心概念拆解
 */

/**
 * @type {boolean}
 * @desc 基础类型 布尔
 */
const flag: boolean = false;

/**
 * @type {number}
 * @desc 基础类型 数值
 */
const count: number = 20;

/**
 * @type {string}
 * @desc 基础类型 字符串
 */
const content: string = '文本';

/**
 * @type {enum}
 * @desc 枚举类型 普通枚举
 */
enum Color01 {
    RED,
    BLUE,
    YELLOW,
}
const red: Color01 = Color01.RED;
console.log(red); // 0

/**
 * @type {enum}
 * @desc 枚举类型 设置初始值
 */
enum Color02 {
    RED = 2,
    BLUE,
    YELLOW,
}
const blue: Color02 = Color02.BLUE;
console.log(blue); // 3

/**
 * @type {enum}
 * @desc 枚举类型 字符串枚举
 */
enum Color03 {
    RED = '红色',
    BLUE = '蓝色',
    YELLOW = '黄色',
}
const yellow: Color03 = Color03.YELLOW;
console.log(yellow); // 黄色

/**
 * @type {enum}
 * @desc 枚举类型 常量枚举
 */
const enum Color04 {
    RED,
    BLUE,
    YELLOW,
}
const colors: Array<Color04> = [Color04.RED, Color04.BLUE, Color04.YELLOW];
console.log(colors); // [0, 1, 2]

/**
 * @type {Array}
 * @desc 数组(Array)类型
 */
const arr1: Array<string> = ['a', 'b', 'c']; // 第一种：泛型类型方式
const arr2: string[] = ['a', 'b', 'c']; // 第二种：普通语法方式

/**
 * @type {Tuple}
 * @desc 元祖(Tuple)类型
 */
const tup: [string, number] = ['abc', 20];

/**
 * @type {undefined}
 * @type {null}
 * @desc
 * 默认情况下 null 和 undefined 是所有类型的子类型。 也就是说你可以把 null 和 undefined 赋值给其他类型
 * 如果tsconfig.json指定了"strictNullChecks":true ，即开启严格模式后， null 和 undefined 只能给它们自己的类型赋值
 * 但是 undefined 可以给 void 赋值
 */

/**
 * @type {any}
 * @desc 任意类型
 * any会跳过类型检查器对值的检查，任何值都可以赋值给any类型
 */
let anyVal: any = 1;
anyVal = 'abc';
anyVal = true;
anyVal = () => {};

/**
 * @type {void}
 * @desc 一般表示函数无返回值
 */
function voidFn(): void {
    console.log('没有返回值');
}

/**
 * @type {never}
 * @desc 一般表示函数永远不可能有返回值
 */
function neverFn01(): never {
    // 情况一：throw错误
    throw new Error('error');
}
function neverFn02(): never {
    // 情况二：死循环
    while (true) {}
}

/**
 * @type {Unknown}
 * @desc
 * 任何值都可以分配给 unknown
 * 但 unknown 只能分配给 unknown 和 any
 */
let unknown001: unknown = 1;
unknown001 = true;
unknown001 = () => {};
const anyVal02: any = unknown001; // 正确
const unknown002: any = unknown001; // 正确
const string003: string = unknown001; // 报错

/**
 * @type {object}
 * object object 类型用于表示所有的非原始类型
 * 即我们不能把 number、string、boolean、symbol等 原始类型赋值给 object。
 * 在严格模式下，null 和 undefined 类型也不能赋给 object
 */
let object: object;
object = {}; // 编译正确
object = 1; // 报错
object = 'abc'; // 报错
object = true; // 报错
object = null; // 严格模式也报错
object = undefined; // 严格模式也报错

/**
 * @type {Object}
 * 大 Object 代表所有拥有 toString、hasOwnProperty 方法的类型
 * 所以所有原始类型、非原始类型都可以赋给 Object(严格模式下 null 和 undefined 不可以)
 */
let bigObject: Object;
bigObject = {}; // 编译正确
bigObject = 1; // 编译正确
bigObject = 'abc'; // 编译正确
bigObject = true; // 编译正确
bigObject = null; // 严格模式也报错
bigObject = undefined; // 严格模式也报错

/**
 * @type {{}}
 * 空对象类型和大 Object 一样 也是表示原始类型和非原始类型的集合
 */
let emptyObj: {}; // 效果同上案例

/**
 * @example class
 * @desc 通过 Class 关键字来定义一个类
 */
class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

/**
 * @example function 函数声明
 */
function add01(x: number, y: number): number {
    return x + y;
}

/**
 * @example function 函数表达式
 */
const add02 = function (x: number, y: number): number {
    return x + y;
};

/**
 * @example function 接口定义函数
 */
interface IAdd03 {
    (x: number, y: number): number;
}

/**
 * @example function 可选参数
 */
const add04 = function (x: number, y?: number): number {
    return y ? x + y : x;
};

/**
 * @example function 默认参数
 */
const add05 = function (x: number, y: number = 20): number {
    return x + y;
};

/**
 * @example function 剩余参数
 */
const add06 = function (...counts: number[]): number {
    return counts.reduce((a, b) => a + b);
};

/**
 * @example function 函数重载
 * @desc 函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能
 * 函数重载真正执行的是同名函数最后定义的函数体
 * 在最后一个函数体定义之前全都属于函数类型定义
 * 不能写具体的函数实现方法 只能定义类型
 */
function add07(x: number, y: number): number;
function add07(x: string, y: string): string;
function add07(x: any, y: any): any {
    return x + y;
}

/**
 * @example 类型推论
 */
let count01 = 1;
count01 = true; // 报错，因为声明时已推论为数值类型
let count02;
count02 = true; // 正确编译，因为声明时没有赋值，所以推论为 any 类型
count02 = 'abc';

/**
 * @example 类型断言
 */
let text: null | string = 'to be or not to be';
// 第一种：as写法
let strLength001: number = (text as string).length;
// 第二种：尖括号写法
let strLength002: number = (<string>text).length;

/**
 * @example 非空断言
 */
let user: string | null | undefined;
console.log(user.toLocaleUpperCase()); // 错误
console.log(user!.toLocaleUpperCase()); // 正确

/**
 * @example 确定赋值断言断言
 */
let value01: number;
console.log(value01); // 错误：不能在赋值前使用该变量
let value02!: number;
console.log(value02); // 正确

/**
 * @example 联合类型
 * @desc 联合类型用|分隔，表示取值可以为多种类型中的一种
 */
let statusCode: string | number;
statusCode = 200;
statusCode = '200';

/**
 * @example 类型别名
 * 类型别名用来给一个类型起个新名字。
 * 它只是起了一个新名字，并没有创建新类型。
 * 类型别名常用于联合类型。
 */
type CountType = number | Array<number>;
function compute(value: CountType) {}
compute(20); // 正确
compute([10, 20]); // 正确
compute('abc'); // 错误

/**
 * @example 交叉类型
 * @description 交叉类型就是跟联合类型相反，用&操作符表示，交叉类型就是两个类型必须存在
 */
interface IPersonA {
    name: string;
    age: number;
}
interface IPersonB {
    name: string;
    gender: string;
}
type PersonC = IPersonA & IPersonB;
let person: PersonC = {
    name: 'zs',
    age: 20,
    gender: '男',
};
/** 交叉类型取的多个类型的并集，但是如果key相同但是类型不同，则该key为never类型  */
interface IpersonA {
    name: string;
}
interface IpersonB {
    name: number;
}
function testAndFn(params: IpersonA & IpersonB) {}
testAndFn({ name: '黄老爷' }); // 不能将类型“string”分配给类型“never”

/**
 * @example 类型守卫
 * 第一种: 【 in 关键字 】
 */
interface InObj01 {
    name: string;
    x: string;
}
interface InObj02 {
    name: string;
    y: string;
}
function isIn(arg: InObj01 | InObj02): string {
    if ('x' in arg) return arg.x;
    if ('y' in arg) return arg.y;
}
isIn({ name: 'demo', x: 'xxx' }); // xxx
isIn({ name: 'demo', x: 'yyy' }); // yyy

/**
 * @example 类型守卫
 * 第二种: 【 typeof 关键字 】
 * typeof 只支持：typeof 'x' === 'typeName' 和 typeof 'x' !== 'typeName'
 * x 必须是 'number', 'string', 'boolean', 'symbol'
 */
function testType(val: string | number): string {
    if (typeof val === 'number') return 'number';
    if (typeof val === 'string') return 'string';
    return '值为其它类型';
}

/**
 * @example 类型守卫
 * 第三种: 【 instanceof 关键字 】
 */
function createDate(val: Date | string): Date {
    if (val instanceof Date) {
        return val;
    } else {
        return new Date(val);
    }
}

/**
 * @example 类型守卫
 * 第四种: 【 自定义保护谓词 】
 */
function isNumber(value: any): value is number {
    return typeof value === 'number';
}
function isString(value: any): value is string {
    return typeof value === 'string';
}

/**
 * @example 接口 interface
 */
interface IPerson {
    readonly name: string; // 只读
    age?: number; // 可选
}

/**
 * @example 接口 索引签名
 * 有时候我们希望一个接口中除了包含必选和可选属性之外，还允许有其他的任意属性，这时我们可以使用「 索引签名 」
 * ! 需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
 */
type NewType = number | string;
interface IPersonC {
    name: string;
    age: number;
    [prop: string]: NewType; // prop字段必须是 string类型 or number类型。 值是any类型或自定义类型
}

/**
 * @example 【 接口与类型别名的区别 】
 * @定义
 * interface: 接口的作用就是为这些类型命名和为你的代码或第三方代码定义数据模型
 * type: 类型别名会给类型(基本类型、联合类型、元组、手写类型)起一个新的名字，不会新建一个类型，只会是一种引用关系
 */
/** 相同点: 1. 接口和类型别名都可以用来描述对象或函数的类型，只是语法不同 */
interface MyInterface1 {
    name: string;
    say(): void;
}
type MyTYpe1 = {
    name: string;
    say(): void;
};
/** 相同点: 2. 都允许扩展 */
// interface 使用『 extends 』实现继承
interface MyInterface2 {
    name: string;
}
interface MyInterface20 extends MyInterface2 {
    age: number;
}
let userI2: MyInterface20 = {
    name: 'zhangsan',
    age: 20,
};
// type 使用『 & 』交叉能力实现
type MyType2 = {
    name: string;
};
type MyType22 = MyType2 & {
    age: number;
};
let userT2: MyType22 = {
    name: 'zhangsan',
    age: 20,
};
/** 不同点: 1. type可以声明基本数据类型别名/联合类型/元组等，而interface不行 */
type MyType3 = number;
type MyType4 = number | string;
type MyType5 = MyType3 | MyType4;
type MyType6 = [number, string, boolean];
/** 不同点: 2. interface可以重载合并声明，而type不行 */
interface MyInterface3 {
    name: string;
}
interface MyInterface3 {
    age: number;
}
let userI3: MyInterface3 = {
    // 此时，MyInterface3同名重载，拥有上面两个属性
    name: 'zhangsan',
    age: 20,
};

/**
 * @example 泛型 基础使用
 * @description 泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
 */
function getValue<T>(arg: T): T {
    // 声明泛型公式
    return arg;
}
getValue<string>('树哥'); // 使用：定义T为string类型
getValue('树哥'); // 使用：自动推导类型为 string

/**
 * @example 泛型 多个参数
 */
function getValue2<T, U>(arg: [T, U]): [T, U] {
    return arg;
}
getValue2<string, number>(['树哥', 20]); // 定义类型
getValue(['树哥', 20]); // 自动推导类型

/**
 * @example 泛型 泛型约束
 */
function getLength<T>(arg: T): number {
    return arg.length; // 报错：因为不确定T的类型，所以不能调用length方法
}
interface LengthWise {
    length: number;
}
function getLength2<T extends LengthWise>(arg: T): number {
    return arg.length; // 编译正确
}

/**
 * @example 泛型 泛型接口
 */
interface IKeyValue<T, U> {
    key: T;
    value: U;
}
let kv01: IKeyValue<string, number> = {
    key: '年龄',
    value: 20,
};
let kv02: IKeyValue<string, string> = {
    key: '姓名',
    value: '张三',
};

/**
 * @example 泛型 泛型类
 */
class Person5<T> {
    value: T;
    add: (x: T, y: T) => T;
}
let user5 = new Person5<number>();
user5.value = 'abc'; // 报错，因为声明的类型是数值
user5.value = 5; // 正确编译
user5.add(3, 5); // 正确编译

/**
 * @example 泛型 泛型类型别名
 */
type DataType<T> = { list: T[] } | T[];
let data01: DataType<string> = { list: ['abc', 'def'] };
let data02: DataType<number> = [1, 2, 3];

/**
 * @example 泛型 泛型默认类型
 */
function createArray<T>(length: number, value: T): T[] {
    let result: Array<T> = [];
    for (let i = 0; i < length; i++) {
        result.push(value);
    }
    return result;
}
createArray<string>(30, '文本'); // 参数1是长度 参数2是内容

/**
 * @example 泛型工具类型
 */
/** 1. typeof
 * 关键词除了做类型保护，还可以从实现推出类型
 */
let obj1 = {
    name: '张三',
    age: 20,
    isMan: true,
};
type PersonType = typeof obj1;
function getPerson(value: PersonType): string {
    return value.name;
}
getPerson(obj1);
/** 2. keyof
 * 可以用来获取一个对象接口中的所有 key 值
 */
interface IPersonD {
    name: string;
    age: number;
    sex: string;
}
type PersonKey = keyof IPersonD;
function getVal(data: IPersonD, key: PersonKey) {
    return data[key];
}
let zsInfo = { name: 'zs', age: 20, sex: '男' };
getVal(zsInfo, 'name'); // zs
getVal(zsInfo, 'age'); // 20
/** 3. in
 * 用来遍历枚举类型
 */
type MyType8 = 'a' | 'b' | 'c';
type DataInterface = {
    [P in MyType8]: string;
};
const data03: DataInterface = {
    a: 'aaa',
    b: 'bbb',
    c: 'ccc',
};
/** 4. infer
 * 在条件类型语句中，可以用 infer 声明一个类型变量并且对它进行使用
 * infer R 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用
 */
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
/** 5. extends
 * 有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束
 */
interface ILengthWise {
    length: number;
}
function getLength3<T extends ILengthWise>(arg: T): number {
    return arg.length;
}
getLength3(3); // 报错：不具备length属性
getLength3({ length: 10, name: '张三' }); // 编译正确
/** 6. 索引访问操作符
 * 使用 [] 操作符可以进行索引访问
 */
interface Person6 {
    name: string;
    age: number;
}
type NameType = Person6['name']; // string
type AgeType = Person6['age']; // number

/**
 * @example 内置工具类型
 */
/** 1. Required
 * 将类型的属性变成必选
 */
interface IPerson1 {
    name: string;
    age?: number;
    sex?: string;
}
let user1: Required<IPerson1>;
user1 = { name: 'zs' }; // 报错，缺少其它两个属性
user1 = { name: 'zs', age: 20, sex: '男' }; // 正常运行
/** 2. Partial
 * 与 Required 相反，将所有属性转换为可选属性
 */
interface IPerson2 {
    name: string;
    age: number;
    sex: string;
}
let user2: Partial<IPerson2>;
user2 = {}; // 正常运行
user2 = { name: 'zs' }; // 正常运行
/** 3. Exclude
 * Exclude<T, U> 的作用是从 T 的属性中移除 U 的属性
 */
type T0 = Exclude<'a' | 'b' | 'c', 'a'>; // "b" | "c"
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
/** 4. Extract
 * 和 Exclude<T, U> 相反, 作用是从 T 中找到 U 的属性，然后组合返回
 */
type T3 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; // "a" | "c"
type T4 = Extract<string | number | (() => void), Function>; // () => void
/** 5. Readonly
 * 把数组或对象的所有属性值转换为只读的，这就意味着这些属性不能被重新赋值
 */
interface IPerson3 {
    name: string;
    age: number;
}
let user3: Readonly<IPerson3> = {
    name: 'zhangsan',
    age: 20,
};
user3.name = 'lisi'; // 报错：无法为“name”赋值，因为它是只读属性
/** 6. Record
 * Record<K extends keyof any, T> 的作用是将 K 中所有的属性的值转化为 T 类型。
 */
type property = 'key01' | 'key02';
type Type1 = Record<property, boolean>;
let type01: Type1 = {
    // 编译正确
    key01: true,
    key02: true,
};
let type02: Type1 = {
    // 报错：属性必须为 boolean
    key01: 'abc',
    key02: 123,
};
/** 7. Pick
 * 从某个类型中挑出一些属性出来
 */
type Type05 = {
    name: string;
    age: number;
    sex: string;
};
type Type06 = Pick<Type05, 'name' | 'sex'>;
let td06: Type06 = {
    name: 'zs',
    sex: '男',
};
/** 8. Omit
 * 与Pick相反，Omit<T,K> 从T中取出除去K的其他所有属性。
 */
type Type07 = {
    name: string;
    age: number;
    sex: string;
};
type Type08 = Omit<Type07, 'name' | 'age'>;
let td08: Type08 = { sex: '男' };
/** 9. NonNullable
 * 去除类型中的 null 和 undefined
 */
type T01 = NonNullable<string | number | null>; // string | number
type T02 = NonNullable<
    null | undefined | Function | Array<null> | Array<undefined>
>; // Function | null[] | undefined[]
/** 10. ReturnType */
type Func01 = (name: string) => string;
let RT01: ReturnType<Func01> = 'abc'; // 编译正确
let RT02: ReturnType<Func01> = 20; // 报错：类型不匹配
/** 11. Parameters
 * 用于获得函数的参数类型所组成的元组类型
 */
type TP01 = Parameters<(name: string, age: number) => string>; // [string, number]
let d01: TP01 = ['zs', 20]; // 正确编译
let d02: TP01 = ['zs', '20']; // 报错：类型不正确
/** 12. InstanceType
 * 返回构造函数类型T的实例类型
 */
class P09 {}
type T09 = InstanceType<typeof P09>; // P09
