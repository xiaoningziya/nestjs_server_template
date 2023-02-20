/**
 * @file 此文件实现一些内置等方法的小能力
 */

/**
 * 使用「 extends 」关键字 实现内置方法
 * @method <NonNullable>
 */
type My_NonNullable<T> = T extends null | undefined ? never : T;
type n01 = My_NonNullable<string | number>; // string | number
type n02 = My_NonNullable<string | null | undefined>;
let d02: n02 = null; // 严格模式报错

/**
 * 分配式extends
 * T extends U ? X : Y
 * 其实就是当上面的T为联合类型的时候，会进行拆分，有点类似数学中的分解因式
 */
type Diff<T, U> = T extends U ? never : T; // 拆解,返回T的差集
type Filter<T, U> = T extends U ? T : never; // 拆解,返回T的交集
type Type01 = 'a' | 'b' | 'c' | 'd' | 'e';
type Type02 = 'a' | 'e' | 'x' | 'y' | 'z';
let diff01: Diff<Type01, Type02>; // "b" | "c" | "d"
let filter01: Filter<Type01, Type02>; // "a" | "e"

/**
 * infer
 * infer X 就相当于声明了一个变量，这个变量随后可以使用，是不是有点像for循环里面的声明语句？
 * 不同的是，infer X的这个位置本应该有一个写死的类型变量，只不过用infer R替换了，更灵活
 * 需要注意的是infer声明的这个变量只能在true分支中使用
 */
// 实现内置 ReturnType
type My_ReturnType<T> = T extends (...arg: any[]) => infer R ? R : any;

/**
 * 实现一个 isString
 */
type isString<T> = T extends string ? true : false;
type I0 = isString<number>; // false
type I1 = isString<11>; // false
type I2 = isString<string>; // true
type I3 = isString<'11'>; // true
type I4 = isString<any>; // boolean
type I5 = isString<never>; // never

/**
 * 实现一个类型判断
 */
type TypeName<T> = T extends string
    ? 'string'
    : T extends number
    ? 'number'
    : T extends boolean
    ? 'boolean'
    : T extends null
    ? 'null'
    : T extends undefined
    ? 'undefined'
    : T extends Function
    ? 'function'
    : 'object';
type T0 = TypeName<123>; // "number"
type T1 = TypeName<'abc'>; // "string"
type T2 = TypeName<true>; // "boolean"
type T3 = TypeName<null>; // 非严格也是 "string"
type T4 = TypeName<undefined>; // 非严格也是 "string"
type T5 = TypeName<{}>; // "object"
// 这里返回的是联合类型，因为传入的是联合类型，所以会被拆解进行三元运算
type T6 = TypeName<123 | 'abc'>; // "string" | "number"

/**
 * 实现几个提取能力
 */
interface User {
    id: number;
    name: string;
    age: number;
    updateName(value: string): void;
    updateAge(value: number): void;
}
// @method 提取方法的key
type FunctionPropertyNames<T> = {
    [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];
type result01 = FunctionPropertyNames<User>; // "updateName" | "updateAge"
// @method 提取方法的key和value
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
type result02 = FunctionProperties<User>; // { updateName: (value: string) => void; updateAge: (value: number) => void;}
// @method 提取属性中除去方法所有的key
type NonFunctionPropertyNames<T> = {
    [P in keyof T]: T[P] extends Function ? never : P;
}[keyof T];
type result03 = NonFunctionPropertyNames<User>; // "id" | "name" | "age"
// @method 提取属性中除去方法所有的key和value
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
type result04 = NonFunctionProperties<User>; // {id: number;name: string;age: number;}
