import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Assignment } from '../entities/assignment.entity';
import { User } from '../entities/user.entity'; 
import { ShiftOccurrence } from 'src/entities/shift-occurence.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment) private repo: Repository<Assignment>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ShiftOccurrence) private occRepo: Repository<ShiftOccurrence>,
  ) {}

  async assignUserToOccurrence(userId: string, occurrenceId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const occ = await this.occRepo.findOneBy({ id: occurrenceId });
    if (!occ) {
      throw new NotFoundException('Occurrence not found');
    }

    const exists = await this.repo.findOne({ where: { user: { id: userId }, occurrence: { id: occurrenceId } } });
    if (exists) throw new Error('User already assigned');
    const assignment = this.repo.create(); 
    assignment.user = Promise.resolve(user) as any;
    assignment.occurrence = Promise.resolve(occ) as any;

    occ.isOpen = false;
    await this.occRepo.save(occ);
    return this.repo.save(assignment);
  }

  async removeAssignment(assignmentId: string) {
    const assignment = await this.repo.findOneBy({ id: assignmentId });
    if (!assignment) throw new Error('Assignment not found'); 
    const occ = await this.occRepo.findOne({ where: { id: assignment.occurrence.id }, relations: ['assignments'] });
    if(!occ){
        throw new NotFoundException("Assignment not found")
    }
    await this.repo.remove(assignment);
    const remaining = await this.repo.count({ where: { occurrence: { id: occ.id } } });
    if (remaining === 0) {
      occ.isOpen = true;
      await this.occRepo.save(occ);
    }
    return true;
  }

  async getUserAssignments(userId: string, start: string, end: string) {
    return this.repo.find({
      where: { user: { id: userId }, occurrence: { date: Between(start, end) } } as any,
      relations: ['occurrence', 'occurrence.shiftTemplate'],
    });
  }
}
