import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Index,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { BaseTimeEntity } from './base-time.entity';
import { AssignmentStatus } from '../enums/assignment-status.enum';
import { OneToMany } from 'typeorm';
import { CannotAttend } from './cannot-attend.entity';
import { ShiftSchedule } from './shift-schedule.entity';

@ObjectType()
@Entity()
@Index(['scheduleId', 'date'], { unique: true })
export class Assignment extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.assignments, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: Promise<User>;

  @Column({ nullable: true })
  userId?: string;

  @Field(() => ShiftSchedule)
  @ManyToOne(() => ShiftSchedule, (s) => s.assignments, { eager: true })
  @JoinColumn({ name: 'scheduleId' })
  schedule: ShiftSchedule;

  @Column()
  scheduleId: string;

  @Field(() => String)
  @Column({ type: 'date' })
  date: Date;

  @Field(() => AssignmentStatus)
  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.OPEN,
  })
  status: AssignmentStatus;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Field(() => [CannotAttend], { nullable: true })
  @OneToMany(() => CannotAttend, (ca) => ca.assignment)
  cannotAttendRecords: Promise<CannotAttend[]>;
}
