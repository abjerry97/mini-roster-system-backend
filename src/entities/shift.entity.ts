import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseTimeEntity } from './base-time.entity';
import { ShiftSchedule } from './shift-schedule.entity';

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

  // @OneToMany(() => Assignment, (assignment) => assignment.shift)
  // assignments: Promise<Assignment[]>;

  @Field(() => [ShiftSchedule], { nullable: true })
  @OneToMany(() => ShiftSchedule, (schedule) => schedule.shift)
  schedules: ShiftSchedule[];
}
