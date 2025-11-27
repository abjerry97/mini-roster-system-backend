import { Module } from '@nestjs/common';
import { CannotAttendResolver } from './cannot-attend.resolver';
import { CannotAttendService } from './cannot-attend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ShiftOccurrence } from 'src/entities/shift-occurence.entity';
import { CannotAttend } from 'src/entities/cannot-attend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ShiftOccurrence, CannotAttend])],
  providers: [CannotAttendResolver, CannotAttendService],
})
export class CannotAttendModule {}
