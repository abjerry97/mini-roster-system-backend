import { Module } from '@nestjs/common';
import { AssignmentResolver } from './assignment.resolver';
import { AssignmentService } from './assignment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from 'src/entities/assignment.entity';
import { User } from 'src/entities/user.entity';
import { ShiftSchedule } from 'src/entities/shift-schedule.entity';

@Module({
  exports: [AssignmentService],
  imports: [TypeOrmModule.forFeature([Assignment, User, ShiftSchedule])],
  providers: [AssignmentResolver, AssignmentService],
})
export class AssignmentModule {}
