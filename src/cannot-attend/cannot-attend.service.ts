import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CannotAttend } from '../entities/cannot-attend.entity';
import { User } from '../entities/user.entity';
import { ShiftOccurrence } from 'src/entities/shift-occurence.entity';

@Injectable()
export class CannotAttendService {
  constructor(
    @InjectRepository(CannotAttend) private repo: Repository<CannotAttend>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ShiftOccurrence)
    private occRepo: Repository<ShiftOccurrence>,
  ) {}

  async markCannotAttend(userId: string, occurrenceId: string, reason: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error(`User not found: ${userId}`);
    const occ = await this.occRepo.findOneBy({ id: occurrenceId });
    if (!occ) throw new Error(`Shift occurrence not found: ${occurrenceId}`);

    const ca = this.repo.create({
      user: { id: userId },
      occurrence: { id: occurrenceId },
      reason,
    } as DeepPartial<CannotAttend>);
    return this.repo.save(ca);
  }
}
