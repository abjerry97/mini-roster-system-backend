import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseTimeEntity } from './base-time.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecurrenceType } from '../enums/recurrence-types.enum';
import { Shift } from './shift.entity';

@ObjectType()
@Entity()
export class ShiftSchedule extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shift, (shift) => shift.schedules, { eager: true })
  shift: Shift;

  @Field()
  @Column({ type: 'date' })
  startDate: Date;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Field(() => RecurrenceType)
  @Column({ type: 'enum', enum: RecurrenceType })
  recurrenceType: RecurrenceType;

  @Column('int', { array: true, nullable: true })
  daysOfWeek?: number[];

  @Column({ default: 1 })
  interval: number;
}
