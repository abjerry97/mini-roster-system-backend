import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseTimeEntity } from './base-time.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { RecurrenceType } from '../enums/recurrence-types.enum';
import { Shift } from './shift.entity';
import { Assignment } from './assignment.entity';

@ObjectType()
@Entity()
export class ShiftSchedule extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Shift)
  @ManyToOne(() => Shift, (shift) => shift.schedules, { eager: true })
  @JoinColumn({ name: 'shiftId' })
  shift: Shift;

  @Column()
  shiftId: string;

  @Field(() => String)
  @Column({ type: 'date' })
  startDate: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Field(() => RecurrenceType)
  @Column({
    type: 'enum',
    enum: RecurrenceType,
    default: RecurrenceType.NONE,
  })
  recurrenceType: RecurrenceType;

  @Field(() => [Number], { nullable: true })
  @Column('int', { array: true, nullable: true })
  daysOfWeek?: number[];

  @Field()
  @Column({ default: 1 })
  interval: number;

  @Field(() => [Assignment], { nullable: true })
  @OneToMany(() => Assignment, (a) => a.schedule)
  assignments: Assignment[];

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  maxAssignments?: number;
}
