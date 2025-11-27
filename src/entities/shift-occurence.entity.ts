import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Assignment } from './assignment.entity';
import { Shift } from './shift.entity';
import { BaseTimeEntity } from './base-time.entity';

@ObjectType()
@Entity()
export class ShiftOccurrence extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shift, (shift) => shift.schedules, { onDelete: 'CASCADE' })
  shift: Shift;

  @Field()
  @Index()
  @Column({ type: 'date' })
  date: string;

  @OneToMany(() => Assignment, (a) => a.occurrence)
  assignments: Assignment[];

  @Field()
  @Column({ default: false })
  isOpen: boolean;
}
