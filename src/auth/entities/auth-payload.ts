import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/enums/role.enum';

@ObjectType()
export class AuthPayload {
  @Field()
  userId: string;

  @Field(() => Role)
  role: Role;

  @Field()
  accessToken: string;
}
