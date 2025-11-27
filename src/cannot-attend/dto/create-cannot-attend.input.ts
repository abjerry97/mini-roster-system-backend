import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateCannotAttendInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  occurrenceId: string;

  @Field()
  @IsNotEmpty()
  @MinLength(5, { message: 'Reason must be at least 5 characters' })
  reason: string;
}
