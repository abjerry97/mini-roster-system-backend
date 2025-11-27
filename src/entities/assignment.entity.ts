import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { BaseTimeEntity } from './base-time.entity';
import { ShiftOccurrence } from './shift-occurence.entity';

@ObjectType()
@Entity()
@Unique(['user', 'occurrence'])
export class Assignment extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.assignments)
  user: Promise<User>;

  @ManyToOne(() => ShiftOccurrence, (o) => o.assignments, { eager: true })
  occurrence: ShiftOccurrence;
}
