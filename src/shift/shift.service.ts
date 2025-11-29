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
import { generateOccurrencesForSchedule } from 'src/utils/recurrence';
import { CreateShiftInput } from './dto/create-shift.input';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { Assignment } from 'src/entities/assignment.entity';
import { AssignmentStatus } from 'src/enums/assignment-status.enum';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift) private shiftRepo: Repository<Shift>,
    @InjectRepository(ShiftSchedule)
    private scheduleRepo: Repository<ShiftSchedule>,
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
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

  async getCalendarShifts(
    startDate: string,
    endDate: string,
  ): Promise<CalendarShift[]> {
    const schedules = await this.scheduleRepo.find({
      where: { isActive: true },
      relations: ['shift', 'assignments','assignments.cannotAttendRecords', 'assignments.user'],
    });

    const calendarShifts: CalendarShift[] = [];

    for (const schedule of schedules) {
      const dates = generateOccurrencesForSchedule(
        schedule,
        startDate,
        endDate,
      );

      for (const dateStr of dates) {
        const assignment = await this.assignmentRepo.findOne({
          where: {
            scheduleId: schedule.id,
            date: new Date(dateStr),
          },
          relations: ['user'],
        });

        const timeslot = this.getTimeslotFromTime(schedule.shift.startTime);

        let status: 'open' | 'assigned' | 'unavailable' = 'open';
        let assignedUserId: string | undefined;
        let assignedUserName: string | undefined;
        let unavailableReason: string | undefined;
        let assignmentId: string | undefined;

        if (assignment) {
          assignmentId = assignment.id;

          if (assignment.status === AssignmentStatus.CANCELLED) {
            status = 'unavailable';
            unavailableReason = assignment?.cannotAttendRecords[0].reason || 'Shift cancelled';
          } else if (
            assignment.status === AssignmentStatus.ASSIGNED &&
            assignment.userId
          ) {
            status = 'assigned';
            assignedUserId = assignment.userId;
            const user = await assignment.user;
            assignedUserName = user?.name;
          }
        }

        calendarShifts.push({
          id: `${schedule.id}-${dateStr}`,
          date: dateStr,
          timeslot,
          startTime: schedule.shift.startTime,
          endTime: schedule.shift.endTime,
          status,
          position: schedule.shift.name,
          assignedUserId,
          assignedUserName,
          unavailableReason,
          assignmentId,
          scheduleId: schedule.id,
          shiftId: schedule.shift.id,
        });
      }
    }

    return calendarShifts.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  }

  private getTimeslotFromTime(timeStr: string): string {
    const hour = parseInt(timeStr.split(':')[0]);

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    return 'night';
  }

  async getUserCalendarShifts(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<CalendarShift[]> {
    const assignments = await this.assignmentRepo.find({
      where: {
        userId,
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['schedule', 'schedule.shift', 'user'],
    }); 
    return assignments.map((assignment) => ({
      id: `${assignment?.scheduleId}-${assignment?.date}`,
      date: `${assignment?.date}`,
      timeslot: this.getTimeslotFromTime(assignment.schedule.shift.startTime),
      startTime: assignment.schedule.shift.startTime,
      endTime: assignment.schedule.shift.endTime,
      status:
        assignment.status === AssignmentStatus.ASSIGNED
          ? 'assigned'
          : assignment.status === AssignmentStatus.CANCELLED
            ? 'unavailable'
            : 'open',
      position: assignment.schedule.shift.name,
      assignedUserId: assignment.userId,
      unavailableReason:
        assignment.status === AssignmentStatus.CANCELLED
          ? assignment.notes
          : undefined,
      assignmentId: assignment.id,
      scheduleId: assignment.scheduleId,
      shiftId: assignment.schedule.shift.id,
    }));
  }

  async getCannotAttendInRange(startDate: string, endDate: string) {
    const assignments = await this.assignmentRepo.find({
      where: {
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: [
        'cannotAttendRecords',
        'cannotAttendRecords.user',
        'schedule',
        'schedule.shift',
      ],
    });

    const cannotAttendList: {
      id: string;
      userId: string;
      userName: string;
      date: string;
      shiftName: string;
      reason?: string;
      assignmentId: string;
    }[] = [];

    for (const assignment of assignments) {
      const records = await assignment.cannotAttendRecords;
      for (const record of records) {
        const user = await record.user;
        cannotAttendList.push({
          id: record.id,
          userId: record.userId,
          userName: user.name,
          date: assignment.date.toISOString().split('T')[0],
          shiftName: assignment.schedule.shift.name,
          reason: record.reason,
          assignmentId: assignment.id,
        });
      }
    }

    return cannotAttendList;
  }
}

export interface CalendarShift {
  id: string;
  date: string;
  timeslot: string;
  startTime: string;
  endTime: string;
  status: 'open' | 'assigned' | 'unavailable';
  position: string;
  assignedUserId?: string;
  assignedUserName?: string;
  unavailableReason?: string;
  assignmentId?: string;
  scheduleId: string;
  shiftId: string;
}
