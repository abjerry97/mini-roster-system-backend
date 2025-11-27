import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ShiftSchedule } from '../entities/shift-schedule.entity';
import { Shift } from 'src/entities/shift.entity';
import { ShiftOccurrence } from 'src/entities/shift-occurence.entity';
import { generateOccurrencesForSchedule } from 'src/utils/recurrence';

@Injectable()
export class ShiftService {
  tplRepo: any;
  constructor(
    @InjectRepository(Shift) private shiftRepo: Repository<Shift>,
    @InjectRepository(ShiftSchedule)
    private scheduleRepo: Repository<ShiftSchedule>,
    @InjectRepository(ShiftOccurrence)
    private occRepo: Repository<ShiftOccurrence>,
  ) {}

  async createShift(data) {
    const tpl = this.shiftRepo.create(data);
    return this.shiftRepo.save(tpl);
  }

  async findAll() {
    return await this.shiftRepo.find();
  }
  async addSchedule(shiftId: string, scheduleData) {
    const shift = await this.shiftRepo.findOneBy({ id: shiftId });
    const schedule = this.scheduleRepo.create({
      ...scheduleData,
      shift: shift,
    });
    return this.scheduleRepo.save(schedule);
  }

  async getOccurrencesInRange(start: string, end: string) {
    const schedules = await this.scheduleRepo.find({
      relations: ['shift'],
    });

    console.log('Loaded schedules:', schedules);

    const occurrences: { date: string; shift: any; scheduleId: string }[] = [];

    for (const s of schedules) {
      const dates = generateOccurrencesForSchedule(s, start, end);

      console.log('Generated for schedule', s.id, dates);

      for (const date of dates) {
        occurrences.push({
          date,
          shift: s.shift,
          scheduleId: s.id,
        });
      }
    }

    return occurrences;
  }

  async ensureOccurrence(shiftTemplateId: string, date: string) {
    let occ = await this.occRepo.findOne({
      where: { shiftTemplate: { id: shiftTemplateId }, date },
    });
    if (!occ) {
      const tpl = await this.tplRepo.findOneBy({ id: shiftTemplateId });
      occ = this.occRepo.create({ shiftTemplate: tpl, date, isOpen: true });
      occ = await this.occRepo.save(occ);
    }
    return occ;
  }
}
