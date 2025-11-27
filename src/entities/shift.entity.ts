import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Assignment } from './assignment.entity';
import { BaseTimeEntity } from './base-time.entity';
import { ShiftSchedule } from './shift-schedule.entity';
import { ShiftOccurrence } from './shift-occurence.entity';

@ObjectType()
@Entity()
export class Shift extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'time' })
  startTime: string;

  @Field()
  @Column({ type: 'time' })
  endTime: string;

  @OneToMany(() => ShiftOccurrence, (o) => o.shiftTemplate)
  occurrences: ShiftOccurrence[];

  // @OneToMany(() => Assignment, (assignment) => assignment.shift)
  // assignments: Promise<Assignment[]>;

  @OneToMany(() => ShiftSchedule, (schedule) => schedule.shift)
  schedules: Promise<ShiftSchedule[]>;
}
