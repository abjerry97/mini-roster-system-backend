import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { RecurrenceType } from 'src/enums/recurrence-types.enum';
import { ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class CalendarShiftType {
  @Field(() => ID)
  id: string;

  @Field()
  date: string;

  @Field()
  timeslot: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  status: string;

  @Field()
  position: string;

  @Field({ nullable: true })
  assignedUserId?: string;

  @Field({ nullable: true })
  assignedUserName?: string;

  @Field({ nullable: true })
  unavailableReason?: string;

  @Field({ nullable: true })
  assignmentId?: string;

  @Field()
  scheduleId: string;

  @Field()
  shiftId: string;
}

@InputType()
export class CreateShiftInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  })
  startTime: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  })
  endTime: string;
}

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsNotEmpty()
  startDate: string;

  @Field({ nullable: true })
  @IsOptional()
  endDate?: string;

  @Field(() => RecurrenceType)
  @IsEnum(RecurrenceType)
  recurrenceType: RecurrenceType;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  daysOfWeek?: number[];

  @Field(() => Int)
  @Min(1)
  interval: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  maxAssignments?: number;
}

@InputType()
export class AssignShiftInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  scheduleId: string;

  @Field()
  @IsNotEmpty()
  @IsDateString()
  date: string;
}

@InputType()
export class MarkCannotAttendInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  assignmentId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  reason: string;
}
