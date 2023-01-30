> 注意：`本参考文献中没有的记录一些装饰器（如@Tree，@ChildEntity 等），因为它们目前还在实验状态。期待将来看到他们的文档。`

# 实体装饰器

## `@Entity`

> 将模型标记为实体。 实体是一个转换为数据库表的类。 你可以在实体中指定表名：

```
@Entity("users")
export class User {
```

> 此代码将创建一个名为"users"的数据库表。

> 你还可以指定一些其他实体选项：

```
name - 表名。 如果未指定，则从实体类名生成表名。
database - 所选 DB 服务器中的数据库名称。
schema - 架构名称。
engine - 在表创建期间设置的数据库引擎（仅在某些数据库中有效）。
synchronize - 架构更新中跳过标有false的实体。
skipSync - 标有此装饰器的实体将从架构更新中跳过。
orderBy - 使用find操作和QueryBuilder指定实体的默认排序。

<!-- 例子: -->
@Entity({
    name: "users",
    engine: "MyISAM",
    database: 'example_dev',
    schema: 'schema_with_best_tables',
    synchronize: false,
    orderBy: {
        name: "ASC",
        id: "DESC"
    }
})
export class User {
```

## `@ViewEntity`

> 视图实体是一个映射到数据库视图的类。

> @ViewEntity() 接收以下参数：

```
name - 视图名称。 如果未指定，则从实体类名生成视图名称。
database - 所选DB服务器中的数据库名称。
schema - 架构名称。
expression - 视图定义。 必需参数。
expression可以是带有正确转义的列和表的字符串，取决于所使用的数据库（示例中为postgres）：

@ViewEntity({
    expression: `
        SELECT "post"."id" "id", "post"."name" AS "name", "category"."name" AS "categoryName"
        FROM "post" "post"
        LEFT JOIN "category" "category" ON "post"."categoryId" = "category"."id"
    `
})
export class PostCategory {
```

> 或者是 QueryBuilder 的一个实例

```
@ViewEntity({
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("post.id", "id")
        .addSelect("post.name", "name")
        .addSelect("category.name", "categoryName")
        .from(Post, "post")
        .leftJoin(Category, "category", "category.id = post.categoryId")
})
export class PostCategory {

<!-- 注意: 由于驱动程序的限制，不支持参数绑定。请改用文字参数。 -->

@ViewEntity({
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("post.id", "id")
        .addSelect("post.name", "name")
        .addSelect("category.name", "categoryName")
        .from(Post, "post")
        .leftJoin(Category, "category", "category.id = post.categoryId")
        .where("category.name = :name", { name: "Cars" })  // <-- 这是错的
        .where("category.name = 'Cars'")                   // <-- 这是对的
})
export class PostCategory {
```

## `@Column` 列装饰器

> 将实体中的属性标记为表列。 例：

```
@Entity("users")
export class User {
@Column({ primary: true })
id: number;

    @Column({ type: "varchar", length: 200, unique: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ default: false })
    isActive: string;

}
```

> @Column 接受可以使用的几个选项：

```
type: ColumnType - 列类型。受支持的 supported column types 其中之一。
name: string -数据库表中的列名。 默认情况下，列名称是从属性的名称生成的。你也可以自定义命名。
length: string|number - 列类型的长度。 例如，如果要创建 varchar（150）类型，请指定列类型和长度选项。
width: number - 列类型的显示宽度。 仅用于 MySQL integer types
onUpdate: string - ON UPDATE 触发器。仅用于 MySQL.
nullable: boolean - 设置列值 NULL 或 NOT NULL。 默认值是 nullable: false。
update: boolean - 指示"save"操作是否更新列值。如果为 false，则只能在第一次插入对象时编写该值。 默认值为"true"。
select: boolean - 定义在进行查询时是否默认隐藏此列。 设置为 false 时，列数据不会显示标准查询。 默认值 select：true。
default: string - 添加数据库级列的 DEFAULT 值。
primary: boolean - 将列标记为主列。 与@PrimaryColumn 使用相同。
unique: boolean - 将列标记为唯一列（创建唯一约束）。
comment: string - 列的注释。 并非所有数据库类型都支持。
precision: number - 十进制（精确数字）列的精度（仅适用于十进制列），这是为值存储的最大位数。用于某些列类型。
scale: number - 十进制（精确数字）列的比例（仅适用于十进制列），表示小数点右侧的位数，且不得大于精度。用于某些列类型。
zerofill: boolean - 将 ZEROFILL 属性设置为数字列。 仅在 MySQL 中使用。 如果是 true，MySQL 会自动将 UNSIGNED 属性添加到此列。
unsigned: boolean - 将 UNSIGNED 属性设置为数字列。 仅在 MySQL 中使用。
charset: string - 定义列字符集。 并非所有数据库类型都支持。
collation: string - 定义列排序规则。
enum: string[]|AnyEnum - 在 enum 列类型中使用，以指定允许的枚举值列表。 你可以指定值数组或指定枚举类。
asExpression: string - 生成的列表达式。 仅用于 MySQL.
generatedType: "VIRTUAL"|"STORED" - 生成的列类型。 仅用于 MySQL.
hstoreType: "object"|"string" - 返回类型 HSTORE 列。 以字符串或对象的形式返回值。 仅用于 Postgres.
array: boolean - 用于可以是数组的 postgres 列类型（例如 int []）。
transformer: ValueTransformer - 指定在读取或写入数据库时用于封送/取消封送此列的值转换器。
spatialFeatureType: string - 可选的要素类型（Point，Polygon，LineString，Geometry）用作空间列的约束。 如果没有指定，默认为 Geometry。 仅在 PostgreSQL 中使用。
srid: number - 可选的 Spatial Reference ID 用作空间列约束。如果未指定，则默认为 0。 标准地理坐标（WGS84 基准面中的纬度/经度）对应于 EPSG 4326。 仅在 PostgreSQL 中使用。
```

## `@PrimaryColumn`

> 将实体中的属性标记为表主列。 与@column 装饰器相同，但需将其 primary 选项设置为 true。 例如：

```
@Entity()
export class User {
@PrimaryColumn()
id: number;
}
```

## `@PrimaryGeneratedColumn`

> 将实体中的属性标记为表生成的主列。 它创建的列是主列，值自动生成。 例如：

```
@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;
}
```

-   有两种策略： - increment - 使用 AUTO_INCREMENT / SERIAL / SEQUENCE（取决于数据库类型）生成增量编号。 - uuid - 生成唯一的 uuid 字符串。
    默认生成策略是 increment，将其更改为 uuid，只需将其作为 decorator 的第一个参数传递：

```
@Entity()
export class User {
@PrimaryGeneratedColumn("uuid")
id: number;
}
```

## `@ObjectIdColumn`

> 将实体中的属性标记为 ObjectID。 此装饰器仅用于 MongoDB。 MongoDB 中的每个实体都必须具有 ObjectID 列。 例如：

```
@Entity()
export class User {
@ObjectIdColumn()
id: ObjectID;
}
```

## `@CreateDateColumn`

> 特殊列，自动设置为实体的插入时间。 不需要在此列中手动写入值，该值会自动设置。 例如：

```
@Entity()
export class User {
@CreateDateColumn()
createdDate: Date;
}
```

## `@UpdateDateColumn`

> 每次从实体管理器或存储库调用 save 时自动设置为实体更新时间的特殊列。 不需要在此列中手动写入值，该值会自动设置。

```
@Entity()
export class User {
@UpdateDateColumn()
updatedDate: Date;
}
```

## `@VersionColumn`

> 每次从实体管理器或存储库调用 save 时自动设置为实体版本（增量编号）的特殊列。 不需要在此列中手动写入值，该值会自动设置。

```
@Entity()
export class User {
@VersionColumn()
version: number;
}
```

## `@Generated`

> 将列标记为生成的值。 例如：

```
@Entity()
export class User {
@Column()
@Generated("uuid")
uuid: string;
}
```

> 在将实体插入数据库之前，只会生成一次值。

# 关系装饰器

## `@OneToOne`

> 一对一是一种 A 只包含一次 B，而 B 只包含一个 A 的实例关系。 我们以 User 和 Profile 实体为例。 用户只能拥有一个 profile，并且一个 profile 仅由一个用户拥有。 例如：

```
import { Entity, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {
@OneToOne(type => Profile, profile => profile.user)
@JoinColumn()
profile: Profile;
}
```

## `@ManyToOne`

> 多对一/一对多是 A 包含多个 B 实例，但 B 只包含一个 A 实例的关系。 我们以 User 和 Photo 实体为例。 User 可以拥有多张 photos，但每张 photo 仅由一位 user 拥有。 例如：

```
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Photo {
@PrimaryGeneratedColumn()
id: number;

    @Column()
    url: string;

    @ManyToOne(type => User, user => user.photos)
    user: User;

}
```

## `@OneToMany`

> 多对一/一对多是 A 包含多个 B 实例，但 B 只包含一个 A 实例的关系。 我们以 User 和 Photo 实体为例。 User 可以拥有多张 photos，但每张 photo 仅由一位 user 拥有。 例如：

```
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;

    @Column()
    name: string;

    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];

}
```

## `@ManyToMany

> 多对多是一种 A 包含多个 B 实例，而 B 包含多个 A 实例的关系。 我们以 Question 和 Category 实体为例。 Question 可以有多个 categories，每个 category 可以有多个 questions。 例如：

```
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Question {
@PrimaryGeneratedColumn()
id: number;

    @Column()
    title: string;

    @Column()
    text: string;

    @ManyToMany(type => Category)
    @JoinTable()
    categories: Category[];

}
```

## `@JoinColumn`

> 定义关系的哪一侧包含具有外键和的联接列允许你自定义联接列名和引用列名。 使用外键定义关系的哪一侧包含 join 列，并允许你自定义 join 列名称和引用的列名称。 例如：

```
@Entity()
export class Post {
@ManyToOne(type => Category)
@JoinColumn({
name: "cat_id",
referencedColumnName: "name"
})
category: Category;
}
```

## `@JoinTable`

> 用于多对多关系，并描述"junction"表的连接列。 Junction 是由 TypeORM 自动创建的一个特殊的独立表，其中列引用了相关实体。

> 你可以使用@JoinColumn 装饰器更改联结表及其引用列中的列名。 还可以更改生成的"junction"表的名称。 例如：

```
@Entity()
export class Post {
@ManyToMany(type => Category)
@JoinTable({
name: "question_categories",
joinColumn: {
name: "question",
referencedColumnName: "id"
},
inverseJoinColumn: {
name: "category",
referencedColumnName: "id"
}
})
categories: Category[];
}
```

> 如果目标表具有复合主键，则必须将一组属性发送到@JoinTable 装饰器。

## `@RelationId`

> 将特定关系的 id（或 id）加载到属性中。 例如，如果你的 Post 实体中有一个多对一的 category，你可以通过用@RelationId 标记一个新属性来获得一个新的类别 id。 例如：

```
@Entity()
export class Post {
@ManyToOne(type => Category)
category: Category;

    @RelationId((post: Post) => post.category) // 需要指定目标关系
    categoryId: number;

}
```

> 此功能适用于所有类型的关系，包括多对多：

```
@Entity()
export class Post {
@ManyToMany(type => Category)
categories: Category[];

    @RelationId((post: Post) => post.categories)
    categoryIds: number[];

}
```

> Relation id 仅用于表现。 链接值时，不会添加/删除/更改基础关系。

# 订阅者和监听者装饰器

## `@AfterLoad`

> 你可以在实体中定义具有任何名称的方法，并使用@AfterLoad 标记，TypeORM 将在每次使用 QueryBuilder 或 repository/ manager 查找方法加载时调用它。 例如：

```
@Entity()
export class Post {
@AfterLoad()
updateCounters() {
if (this.likesCount === undefined) this.likesCount = 0;
}
}
```

## `@BeforeInsert`

> 你可以在实体中定义任何名称的方法，并使用@BeforeInsert 标记，TypeORM 将在使用 repository/managersave 插入实体之前调用它。 例如：

```
@Entity()
export class Post {
@BeforeInsert()
updateDates() {
this.createdDate = new Date();
}
}
```

## `@AfterInsert`

> 你可以在实体中定义任何名称的方法，并使用@AfterInsert 标记，TypeORM 将在使用 repository/managersave 插入实体后调用它。 例如：

```
@Entity()
export class Post {
@AfterInsert()
resetCounters() {
this.counters = 0;
}
}
```

## `@BeforeUpdate`

> 你可以在实体中定义任何名称的方法，并使用@BeforeUpdate 标记，TypeORM 将在使用 repository/managersave 更新现有实体之前调用它。 例如：

```
@Entity()
export class Post {
@BeforeUpdate()
updateDates() {
this.updatedDate = new Date();
}
}
```

## `@AfterUpdate`

> 你可以在实体中定义任何名称的方法，并使用@AfterUpdate 标记，TypeORM 将在使用存储库/管理器 save 更新现有实体之后调用它。 例如：

```
@Entity()
export class Post {
@AfterUpdate()
updateCounters() {
this.counter = 0;
}
}
```

## `@BeforeRemove`

> 你可以在实体中定义任何名称的方法，并使用@BeforeRemove 标记，TypeORM 将在使用 repository/managerremove 删除实体之前调用它。 例如：

```
@Entity()
export class Post {
@BeforeRemove()
updateStatus() {
this.status = "removed";
}
}
```

## `@AfterRemove`

> 你可以在实体中定义一个任何名称的方法，并使用@AfterRemove 标记它，TypeORM 将在使用 repository/managerremove 删除实体之后调用它。 例如：

```
@Entity()
export class Post {
@AfterRemove()
updateStatus() {
this.status = "removed";
}
}
```

## `@BeforeSoftRemove`

> 你可以在实体中定义任何名称的方法，并使用@BeforeSoftRemove 标记，TypeORM 将在使用 repository/managersoftRemove 删除实体之前调用它。 例如：

```
@Entity()
export class Post {
@BeforeSoftRemove()
updateStatus() {
this.status = "soft-removed";
}
}
```

## `@AfterSoftRemove`

> 你可以在实体中定义一个任何名称的方法，并使用@AfterSoftRemove 标记它，TypeORM 将在使用 repository/managersoftRemove 删除实体之后调用它。 例如：

```
@Entity()
export class Post {
@AfterSoftRemove()
updateStatus() {
this.status = "soft-removed";
}
}
```

## `@BeforeRecover`

> 你可以在实体中定义任何名称的方法，并使用@BeforeRecover 标记，TypeORM 将在使用 repository/managerrecover 删除实体之前调用它。 例如：

```
@Entity()
export class Post {
@BeforeRecover()
updateStatus() {
this.status = "recovered";
}
}
```

## `@AfterRecover`

> 你可以在实体中定义一个任何名称的方法，并使用@AfterRecover 标记它，TypeORM 将在使用 repository/managerrecover 删除实体之后调用它。 例如：

```
@Entity()
export class Post {
@AfterRecover()
updateStatus() {
this.status = "recovered";
}
}
```

## `@EventSubscriber`

> 将类标记为可以侦听特定实体事件或任何实体事件的事件订阅者。 使用 QueryBuilder 和 repository/manager 方法触发事件。 例如：

```
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
/\*\*
_ 表示此订阅者仅侦听 Post 事件。
_/
listenTo() {
return Post;
}

    /**
     * 在POST INSERTED之前调用。
     */
    beforeInsert(event: InsertEvent<Post>) {
        console.log(`BEFORE POST INSERTED: `, event.entity);
    }

}
```

> 你可以从 EntitySubscriberInterface 实现任何方法。 要监听任何实体，只需省略 listenTo 方法并使用 any：

```
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {
/\*\*
_ 在 ENTITY INSERTED 之前
_/
beforeInsert(event: InsertEvent<any>) {
console.log(`BEFORE ENTITY INSERTED: `, event.entity);
}
}
```

# 其他装饰器

## `@Index`

> 此装饰器允许你为特定列创建数据库索引。 它还允许你将列或列标记为唯一。 此装饰器可以应用于列或实体本身。 单列索引时使用或多列索引时使用。 例如：

```
@Entity()
export class User {
@Index()
@Column()
firstName: string;

    @Index({ unique: true })
    @Column()
    lastName: string;

}
```

```
@Entity()
@Index(["firstName", "lastName"])
@Index(["lastName", "middleName"])
@Index(["firstName", "lastName", "middleName"], { unique: true })
export class User {
@Column()
firstName: string;

    @Column()
    lastName: string;

    @Column()
    middleName: string;

}
```

## `@Unique`

> 此装饰器允许你为特定列创建数据库唯一约束。 该装饰器只能应用于实体本身。例如:

```
@Entity()
@Unique(["firstName"])
@Unique(["lastName", "middleName"])
@Unique("UQ_NAMES", ["firstName", "lastName", "middleName"])
export class User {
@Column()
firstName: string;

    @Column()
    lastName: string;

    @Column()
    middleName: string;

}
```

> `注意：MySQL 将唯一约束存储为唯一索引`

## `@Check`

> 此装饰器允许为特定列创建数据库检查约束。 该装饰器只能应用于实体本身。例如:

```
@Entity()
@Check(`"firstName" <> 'John' AND "lastName" <> 'Doe'`)
@Check(`"age" > 18`)
export class User {
@Column()
firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}
```

> `注意：MySQL 不支持检查约束。`

## `@Transaction, @TransactionManager 和 @TransactionRepository`

> @Transaction 用于方法上，并将其所有的执行包裹到单个数据库事务中。 必须使用@TransactionManager 提供的管理器执行所有数据库查询 或者使用@TransactionRepository 注入的事务存储库。 例如：

```
@Transaction()
save(@TransactionManager() manager: EntityManager, user: User) {
return manager.save(user);
}

@Transaction()
save(user: User, @TransactionRepository(User) userRepository: Repository<User>) {
return userRepository.save(user);
}

@Transaction()
save(@QueryParam("name") name: string, @TransactionRepository() userRepository: UserRepository) {
return userRepository.findByName(name);
}
```

> `注意：事务中的所有操作必须且只能使用提供的 EntityManager 实例或注入的存储库。 使用任何其他查询源（全局管理器，全局存储库等）将导致错误和错误。`

## `@EntityRepository`

> 将自定义类标记为实体存储库。 例如：

```
@EntityRepository()
export class UserRepository {
/// ... 定制存储库方法 ...
}
```

> 你可以使用 connection.getCustomRepository 或 entityManager.getCustomRepository 方法获取任何自定义创建的存储库。
