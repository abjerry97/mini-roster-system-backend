import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
