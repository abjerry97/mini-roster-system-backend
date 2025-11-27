import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AssignmentService } from './assignment.service';
import { AssignUserInput } from 'src/shift/dto/assign-user.input';

@Resolver()
export class AssignmentResolver {
  constructor(private readonly assignService: AssignmentService) {}

  @Mutation(() => Boolean)
  async assignUser(@Args('input') input: AssignUserInput) {
    await this.assignService.assignUserToOccurrence(
      input.userId,
      input.occurrenceId,
    );
    return true;
  }

  @Mutation(() => Boolean)
  async removeAssignment(@Args('id') id: string) {
    await this.assignService.removeAssignment(id);
    return true;
  }
}
