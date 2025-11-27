import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShiftService } from './shift.service';
import { CreateShiftInput } from './dto/create-shift.input';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { Shift } from 'src/entities/shift.entity';
import { OccurrenceOutput } from './dto/occurrence-output';

@Resolver()
export class ShiftResolver {
  constructor(private readonly shiftService: ShiftService) {}

  @Mutation(() => Boolean)
  async createShift(@Args('input') input: CreateShiftInput) {
    await this.shiftService.createShift(input);
    return true;
  }

  @Query(() => [Shift], { name: 'shift' })
  async findAll() {
    return await this.shiftService.findAll();
  }

  @Mutation(() => Boolean)
  async addSchedule(
    @Args('shiftId') shiftId: string,
    @Args('input') input: CreateScheduleInput,
  ) {
    await this.shiftService.addSchedule(shiftId, input);
    return true;
  }

  @Query(() => [OccurrenceOutput])
  async generatedOccurrences(
    @Args('start') start: string,
    @Args('end') end: string,
  ) {
    const generated = await this.shiftService.getOccurrencesInRange(start, end);

    return generated.map((g) => {
      return { date: g.date, name: g.shift.name, startTime: g.shift.startTime };
    });
  }
}
