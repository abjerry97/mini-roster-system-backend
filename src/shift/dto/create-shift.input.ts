import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';
import { RecurrenceType } from 'src/enums/recurrence-types.enum';

@InputType()
export class CreateShiftInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  startTime: string;

  @Field()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  endTime: string;

  @Field(() => RecurrenceType)
  recurrenceType: RecurrenceType;

  @Field(() => [Int], { nullable: true })
  daysOfWeek?: number[];
}
