import { v4 } from 'uuid';
import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

export interface IEmployee {
  firstName: string;
  lastName: string;
  age: number;
}

@Entity({ tableName: 'employees' })
export class Employee extends BaseEntity {
  @PrimaryKey({ columnType: 'uuid' })
  id = v4();

  @Property({ fieldName: 'first_name', columnType: 'text' })
  firstName: string;

  @Property({ fieldName: 'last_name', columnType: 'text' })
  lastName: string;

  @Property({ fieldName: 'age', columnType: 'integer' })
  age: number;

}
