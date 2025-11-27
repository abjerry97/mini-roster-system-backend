import { Module } from '@nestjs/common';
import { AssignmentResolver } from './assignment.resolver';
import { AssignmentService } from './assignment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from 'src/entities/assignment.entity';
import { User } from 'src/entities/user.entity';
import { ShiftOccurrence } from 'src/entities/shift-occurence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, User, ShiftOccurrence])],
  providers: [AssignmentResolver, AssignmentService],
})
export class AssignmentModule {}
