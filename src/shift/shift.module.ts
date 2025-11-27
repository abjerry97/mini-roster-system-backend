import { Module } from '@nestjs/common';
import { ShiftResolver } from './shift.resolver';
import { ShiftService } from './shift.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from 'src/entities/shift.entity';
import { ShiftSchedule } from 'src/entities/shift-schedule.entity';
import { ShiftOccurrence } from 'src/entities/shift-occurence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, ShiftSchedule, ShiftOccurrence])],
  providers: [ShiftResolver, ShiftService],
})
export class ShiftModule {}
