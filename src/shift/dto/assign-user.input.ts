import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsDateString } from 'class-validator';

@InputType()
export class AssignUserInput {
  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsUUID()
  occurrenceId: string;
}
