import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsArray, Min } from 'class-validator';
import { RecurrenceType } from 'src/enums/recurrence-types.enum';

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsDateString()
  startDate: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => RecurrenceType)
  recurrenceType: RecurrenceType;

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  daysOfWeek?: number[];

  @Field({ nullable: true })
  @Min(1)
  interval?: number;
}
