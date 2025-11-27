import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ShiftSchedule } from '../entities/shift-schedule.entity';
import { Shift } from 'src/entities/shift.entity';
import { ShiftOccurrence } from 'src/entities/shift-occurence.entity';
import { generateOccurrencesForSchedule } from 'src/utils/recurrence';
import { CreateShiftInput } from './dto/create-shift.input';
import { CreateScheduleInput } from './dto/create-schedule.input';

@Injectable()
export class ShiftService {
  tplRepo: any;
  constructor(
    @InjectRepository(Shift) private shiftRepo: Repository<Shift>,
    @InjectRepository(ShiftSchedule)
    private scheduleRepo: Repository<ShiftSchedule>,
    @InjectRepository(ShiftOccurrence)
    private occRepo: Repository<ShiftOccurrence>,
  ) {}

  async createShift(data: CreateShiftInput) {
    const { name, startTime, endTime } = data;

    if (!name || !startTime || !endTime) {
      throw new Error('Shift name, startTime and endTime are required');
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (start >= end) {
      throw new Error('Start time must be earlier than end time');
    }

    const existing = await this.shiftRepo.findOne({
      where: [{ name }, { startTime, endTime }],
    });

    if (existing) {
      throw new Error('A shift with same name or time already exists');
    }

    const shift = this.shiftRepo.create({
      name: name.trim(),
      startTime,
      endTime,
    });

    return this.shiftRepo.save(shift);
  }

  async findAll() {
    return this.shiftRepo.find({
      relations: ['schedules'],
    });
  }

  async addSchedule(shiftId: string, scheduleData: CreateScheduleInput) {
    if (!shiftId) {
      throw new BadRequestException('shiftId is required');
    }

    const shift = await this.shiftRepo.findOneBy({ id: shiftId });

    if (!shift) {
      throw new NotFoundException(`Shift not found with id: ${shiftId}`);
    }

    if (!scheduleData) {
      throw new BadRequestException('Schedule data is required');
    }

    if (!scheduleData.startDate) {
      throw new BadRequestException('startDate is required');
    }
    if (!scheduleData.endDate) {
      throw new BadRequestException('endDate is required');
    }

    if (!scheduleData.interval) {
      throw new BadRequestException('interval is required');
    }

    const startDate = new Date(scheduleData.startDate);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid startDate format');
    }

    const existing = await this.scheduleRepo.findOne({
      where: {
        shift: { id: shiftId },
        startDate: startDate,
        interval: scheduleData.interval,
        recurrenceType: scheduleData.recurrenceType,
      },
    });

    if (existing) {
      throw new ConflictException(
        'A similar schedule already exists for this shift',
      );
    }

    const schedule = this.scheduleRepo.create({
      ...scheduleData,
      shift,
    });

    return this.scheduleRepo.save(schedule);
  }

  async getOccurrencesInRange(start: string, end: string) {
    const schedules = await this.scheduleRepo.find({
      relations: ['shift'],
    });

    const occurrences: { date: string; shift: any; scheduleId: string }[] = [];

    for (const s of schedules) {
      const dates = generateOccurrencesForSchedule(s, start, end);

      for (const date of dates) {
        occurrences.push({
          date,
          shift: s.shift,
          scheduleId: s.id,
        });
      }
    }

    return occurrences;
  }

  // async ensureOccurrence(shiftId: string, date: string) {
  //   if (!shiftId) {
  //     throw new BadRequestException('shiftId is required');
  //   }
  //   if (!date) {
  //     throw new BadRequestException('date is required');
  //   }

  //   const occurrenceDate = new Date(date);
  //   if (isNaN(occurrenceDate.getTime())) {
  //     throw new BadRequestException('Invalid date format');
  //   }

  //   let occ = await this.occRepo.findOne({
  //     where: { shift: { id: shiftId }, date: occurrenceDate.toISOString() },
  //   });

  //   if (!occ) {
  //     const tpl = await this.tplRepo.findOneBy({ id: shiftId });
  //     if (!tpl) {
  //       throw new NotFoundException(
  //         `Shift template not found with id: ${shiftId}`,
  //       );
  //     }

  //     occ = this.occRepo.create({
  //       shift: tpl,
  //       date: occurrenceDate.toISOString(),
  //       isOpen: true,
  //     });

  //     occ = await this.occRepo.save(occ);
  //   }

  //   return occ;
  // }
}
