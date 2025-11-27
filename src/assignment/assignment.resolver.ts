import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AssignmentService } from './assignment.service';
import { Assignment } from '../entities/assignment.entity';
import { AssignUserInput } from 'src/shift/dto/assign-user.input';

@Resolver(() => Assignment)
export class AssignmentResolver {
  constructor(private readonly assignService: AssignmentService) {}

  @Mutation(() => Assignment)
  async assignUser(@Args('input') input: AssignUserInput) {
    return this.assignService.assignUserToOccurrence(
      input.userId,
      input.scheduleId,
      input.date,
    );
  }

  @Mutation(() => Boolean)
  async removeAssignment(@Args('assignmentId') assignmentId: string) {
    await this.assignService.removeAssignment(assignmentId);
    return true;
  }

  @Mutation(() => Assignment)
  async cancelShift(
    @Args('scheduleId') scheduleId: string,
    @Args('date') date: string,
    @Args('reason', { nullable: true }) reason?: string,
  ) {
    return this.assignService.cancelShift(scheduleId, date, reason);
  }

  @Mutation(() => Assignment)
  async reopenShift(
    @Args('scheduleId') scheduleId: string,
    @Args('date') date: string,
  ) {
    return this.assignService.reopenShift(scheduleId, date);
  }

  @Query(() => [Assignment])
  async userAssignments(
    @Args('userId') userId: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return this.assignService.getUserAssignments(userId, startDate, endDate);
  }

  @Query(() => [Assignment])
  async assignmentsInRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return this.assignService.getAssignmentsInRange(startDate, endDate);
  }
}
