import { Module } from '@nestjs/common';
import { ShiftResolver } from './shift.resolver';
import { ShiftService } from './shift.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from 'src/entities/shift.entity';
import { ShiftSchedule } from 'src/entities/shift-schedule.entity';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { Assignment } from 'src/entities/assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift, ShiftSchedule, Assignment]),
    AssignmentModule,
  ],
  providers: [ShiftResolver, ShiftService],
})
export class ShiftModule {}
