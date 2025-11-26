import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { Shift } from './shift.entity';
import { BaseTimeEntity } from './base-time.entity';

@ObjectType()
@Entity()
@Unique(['user', 'shift'])
export class Assignment  extends BaseTimeEntity{
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.assignments)
user: Promise<User>;


  @Field(() => Shift)
  @ManyToOne(() => Shift, (shift) => shift.assignments, { eager: true })
  shift: Promise<Shift>;
}
