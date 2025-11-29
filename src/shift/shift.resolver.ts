import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShiftService } from './shift.service';
import { Shift } from '../entities/shift.entity';
import { ShiftSchedule } from '../entities/shift-schedule.entity';
import { Assignment } from '../entities/assignment.entity';
import { CalendarShiftType, CreateShiftInput } from './dto/create-shift.input';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { AssignmentService } from 'src/assignment/assignment.service';

@Resolver(() => Shift)
export class ShiftResolver {
  constructor(
    private shiftService: ShiftService,
    private assignmentService: AssignmentService,
  ) {}

  @Query(() => [Shift])
  async shifts() {
    return this.shiftService.findAll();
  }

  @Query(() => [CalendarShiftType])
  async calendarShifts(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return this.shiftService.getCalendarShifts(startDate, endDate);
  }

  @Query(() => [CalendarShiftType])
  async userCalendarShifts(
    @Args('userId') userId: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return this.shiftService.getUserCalendarShifts(userId, startDate, endDate);
  }

  @Mutation(() => Shift)
  async createShift(@Args('input') input: CreateShiftInput) {
    return this.shiftService.createShift(input);
  }

  @Mutation(() => ShiftSchedule)
  async addSchedule(
    @Args('shiftId') shiftId: string,
    @Args('input') input: CreateScheduleInput,
  ) {
    return this.shiftService.addSchedule(shiftId, input);
  }

  @Mutation(() => Assignment)
  async assignUserToShift(
    @Args('userId') userId: string,
    @Args('scheduleId') scheduleId: string,
    @Args('date') date: string,
  ) {

    console.log(userId,scheduleId,date)
    return this.assignmentService.assignUserToOccurrence(
      userId,
      scheduleId,
      date,
    );
  }

  @Mutation(() => Boolean)
  async removeAssignment(@Args('assignmentId') assignmentId: string) {
    return this.assignmentService.removeAssignment(assignmentId);
  }

  @Mutation(() => Assignment)
  async cancelShift(
    @Args('scheduleId') scheduleId: string,
    @Args('date') date: string,
    @Args('reason', { nullable: true }) reason?: string,
  ) {
    return this.assignmentService.cancelShift(scheduleId, date, reason);
  }

  @Mutation(() => Assignment)
  async reopenShift(
    @Args('scheduleId') scheduleId: string,
    @Args('date') date: string,
  ) {
    return this.assignmentService.reopenShift(scheduleId, date);
  }

  @Query(() => [Assignment])
  async userAssignments(
    @Args('userId') userId: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    return this.assignmentService.getUserAssignments(
      userId,
      startDate,
      endDate,
    );
  }
}
