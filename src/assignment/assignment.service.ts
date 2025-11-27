import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Assignment } from '../entities/assignment.entity';
import { User } from '../entities/user.entity';
import { ShiftSchedule } from 'src/entities/shift-schedule.entity';
import { AssignmentStatus } from 'src/enums/assignment-status.enum';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment) private repo: Repository<Assignment>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ShiftSchedule)
    private scheduleRepo: Repository<ShiftSchedule>,
  ) {}

  async assignUserToOccurrence(
    userId: string,
    scheduleId: string,
    date: string,
  ) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const schedule = await this.scheduleRepo.findOneBy({ id: scheduleId });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const assignmentDate = new Date(date);
    if (isNaN(assignmentDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const existing = await this.repo.findOne({
      where: {
        scheduleId,
        date: assignmentDate,
      },
    });

    if (existing) {
      if (existing.userId === userId) {
        throw new BadRequestException('User already assigned to this shift');
      }
      throw new BadRequestException(
        'This shift is already assigned to another user',
      );
    }

    const assignment = this.repo.create({
      userId,
      scheduleId,
      date: assignmentDate,
      status: AssignmentStatus.ASSIGNED,
    });

    return this.repo.save(assignment);
  }

  async removeAssignment(assignmentId: string) {
    const assignment = await this.repo.findOne({
      where: { id: assignmentId },
      relations: ['schedule'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.repo.remove(assignment);
    return true;
  }

  async cancelShift(scheduleId: string, date: string, reason?: string) {
    const schedule = await this.scheduleRepo.findOneBy({ id: scheduleId });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const assignmentDate = new Date(date);

    let assignment = await this.repo.findOne({
      where: { scheduleId, date: assignmentDate },
    });

    if (!assignment) {
      assignment = this.repo.create({
        scheduleId,
        date: assignmentDate,
        status: AssignmentStatus.CANCELLED,
        notes: reason,
      });
    } else {
      assignment.status = AssignmentStatus.CANCELLED;
      assignment.notes = reason;
      assignment.userId = undefined;
    }

    return this.repo.save(assignment);
  }

  async reopenShift(scheduleId: string, date: string) {
    const assignmentDate = new Date(date);

    const assignment = await this.repo.findOne({
      where: { scheduleId, date: assignmentDate },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.CANCELLED) {
      throw new BadRequestException('Shift is not cancelled');
    }

    assignment.status = AssignmentStatus.OPEN;
    assignment.notes = undefined;

    return this.repo.save(assignment);
  }

  async getUserAssignments(userId: string, start: string, end: string) {
    return this.repo.find({
      where: {
        userId,
        date: Between(new Date(start), new Date(end)),
        status: AssignmentStatus.ASSIGNED,
      },
      relations: ['schedule', 'schedule.shift'],
      order: { date: 'ASC' },
    });
  }

  async getAssignmentsInRange(start: string, end: string) {
    return this.repo.find({
      where: {
        date: Between(new Date(start), new Date(end)),
      },
      relations: ['schedule', 'schedule.shift', 'user'],
      order: { date: 'ASC' },
    });
  }
}
