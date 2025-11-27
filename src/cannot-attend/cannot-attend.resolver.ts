import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CannotAttend } from '../entities/cannot-attend.entity';
import { CannotAttendService } from './cannot-attend.service';
import { CreateCannotAttendInput } from './dto/create-cannot-attend.input';

@Resolver(() => CannotAttend)
export class CannotAttendResolver {
  constructor(private readonly cannotAttendService: CannotAttendService) {}

  @Mutation(() => CannotAttend)
  async createCannotAttend(@Args('input') input: CreateCannotAttendInput) {
    const { userId, occurrenceId, reason } = input;

    return this.cannotAttendService.markCannotAttend(
      userId,
      occurrenceId,
      reason,
    );
  }
}
