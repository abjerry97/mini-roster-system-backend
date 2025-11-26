import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OccurrenceOutput {
  @Field()
  date: string;

  @Field()
  name: string;

  @Field()
  startTime: string;
}
