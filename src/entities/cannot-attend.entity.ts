import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { Shift } from './shift.entity';
import { BaseTimeEntity } from './base-time.entity';

@ObjectType()
@Entity()
export class CannotAttend  extends BaseTimeEntity{
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  reason: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cannotAttend, { eager: true })
  user: Promise<User>;

  @Field(() => Shift)
  @ManyToOne(() => Shift, { eager: true })
  shift: Promise<Shift>;

}
