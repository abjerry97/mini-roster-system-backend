import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCannotAttendInput {
  @Field()
  userId: string;

  @Field()
  occurrenceId: string;

  @Field()
  reason: string;
}
