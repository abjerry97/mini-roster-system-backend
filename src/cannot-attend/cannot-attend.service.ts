import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CannotAttend } from '../entities/cannot-attend.entity';
import { User } from '../entities/user.entity';
import { Assignment } from 'src/entities/assignment.entity';
import { AssignmentStatus } from 'src/enums/assignment-status.enum';

@Injectable()
export class CannotAttendService {
  constructor(
    @InjectRepository(CannotAttend) private repo: Repository<CannotAttend>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
  ) { }

  async markCannotAttend(userId: string, assignmentId: string, reason: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
      relations: ['schedule'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment not found: ${assignmentId}`);
    }

    if (assignment.userId !== userId) {
      throw new BadRequestException('User is not assigned to this shift');
    }

    const existing = await this.repo.findOne({
      where: { userId, assignmentId },
    });

    if (existing) {

      throw new BadRequestException('Cannot attend record already exists');
    }

    const cannotAttend = this.repo.create({
      userId,
      assignmentId,
      reason,
    });

    this.assignmentRepo.update({ id: assignmentId }, { status: AssignmentStatus.CANCELLED })
    return this.repo.save(cannotAttend);
  }

  async markCannotAttendByScheduleDate(
    userId: string,
    scheduleId: string,
    date: string,
    reason: string,
  ) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const assignmentDate = new Date(date);

    const assignment = await this.assignmentRepo.findOne({
      where: { scheduleId, date: assignmentDate },
    });

    if (!assignment) {
      throw new NotFoundException(
        'Assignment not found for this schedule and date',
      );
    }

    return this.markCannotAttend(userId, assignment.id, reason);
  }

  async removeCannotAttend(cannotAttendId: string) {
    const record = await this.repo.findOneBy({ id: cannotAttendId });
    if (!record) {
      throw new NotFoundException('Cannot attend record not found');
    }

    await this.repo.remove(record);
    return true;
  }

  async getUserCannotAttend(userId: string, start?: string, end?: string) {
    const queryBuilder = this.repo
      .createQueryBuilder('ca')
      .leftJoinAndSelect('ca.assignment', 'assignment')
      .leftJoinAndSelect('assignment.schedule', 'schedule')
      .leftJoinAndSelect('schedule.shift', 'shift')
      .where('ca.userId = :userId', { userId });

    if (start && end) {
      queryBuilder.andWhere('assignment.date BETWEEN :start AND :end', {
        start: new Date(start),
        end: new Date(end),
      });
    }

    return queryBuilder.orderBy('assignment.date', 'ASC').getMany();
  }

  async getCannotAttendInRange(start: string, end: string) {
    return this.repo
      .createQueryBuilder('ca')
      .leftJoinAndSelect('ca.user', 'user')
      .leftJoinAndSelect('ca.assignment', 'assignment')
      .leftJoinAndSelect('assignment.schedule', 'schedule')
      .leftJoinAndSelect('schedule.shift', 'shift')
      .where('assignment.date BETWEEN :start AND :end', {
        start: new Date(start),
        end: new Date(end),
      })
      .orderBy('assignment.date', 'ASC')
      .getMany();
  }
}
