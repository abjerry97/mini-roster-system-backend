import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

@InputType()
export class AssignUserInput {
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
