import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { BaseTimeEntity } from './base-time.entity';
import { Assignment } from './assignment.entity';

@ObjectType()
@Entity()
export class CannotAttend extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text' })
  reason: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cannotAttend)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Column()
  userId: string;

  @Field(() => Assignment)
  @ManyToOne(() => Assignment, (assignment) => assignment.cannotAttendRecords)
  @JoinColumn({ name: 'assignmentId' })
  assignment: Promise<Assignment>;

  @Column()
  assignmentId: string;
}
