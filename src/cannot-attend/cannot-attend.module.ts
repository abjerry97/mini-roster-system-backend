import { Module } from '@nestjs/common';
import { CannotAttendResolver } from './cannot-attend.resolver';
import { CannotAttendService } from './cannot-attend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CannotAttend } from 'src/entities/cannot-attend.entity';
import { ShiftSchedule } from 'src/entities/shift-schedule.entity';
import { Assignment } from 'src/entities/assignment.entity';

@Module({
  exports: [CannotAttendService],
  imports: [
    TypeOrmModule.forFeature([User, CannotAttend, ShiftSchedule, Assignment]),
  ],
  providers: [CannotAttendResolver, CannotAttendService],
})
export class CannotAttendModule {}
