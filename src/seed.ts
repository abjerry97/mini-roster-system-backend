import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { AppModule } from './app/app.module';
import { v4 as uuidv4 } from 'uuid';
import { Shift } from './entities/shift.entity';
import { RecurrenceType } from './enums/recurrence-types.enum';
import { ShiftSchedule } from './entities/shift-schedule.entity';
import { Assignment } from './entities/assignment.entity';
import { AssignmentStatus } from './enums/assignment-status.enum';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get(getRepositoryToken(User));
  const shiftRepo = app.get(getRepositoryToken(Shift));
  const scheduleRepo = app.get(getRepositoryToken(ShiftSchedule));
  const assignmentRepo = app.get(getRepositoryToken(Assignment));

  const existingAdmin = await userRepo.findOne({ where: { role: Role.ADMIN } });

  if (!existingAdmin) {
    await userRepo.save({
      uid: uuidv4(),
      name: 'Admin User',
      email: 'admin@example.com',
      role: Role.ADMIN,
      password: await bcrypt.hash('admin123', 10),
    });

    console.log('✅ Default admin created');
  }

  for (let i = 0; i < 10; i++) {
    await userRepo.save({
      uid: uuidv4(),
      name: faker.internet.displayName(),
      email: faker.internet.email(),
      role: Role.USER,
      password: await bcrypt.hash('user123', 10),
    });

    console.log('✅ Users created');
  }

  const morningShift = await shiftRepo.save({
    name: 'Morning Shift',
    startTime: '06:00',
    endTime: '14:00',
  });

  const afternoonShift = await shiftRepo.save({
    name: 'Afternoon Shift',
    startTime: '14:00',
    endTime: '22:00',
  });

  const nightShift = await shiftRepo.save({
    name: 'Night Shift',
    startTime: '22:00',
    endTime: '06:00',
  });

  console.log('✅ Shifts created');

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const morningSchedule = await scheduleRepo.save({
    shiftId: morningShift.id,
    startDate: today,
    endDate: nextMonth,
    recurrenceType: RecurrenceType.WEEKLY,
    daysOfWeek: [1, 2, 3, 4, 5],
    interval: 1,
    isActive: true,
  });

  const afternoonSchedule = await scheduleRepo.save({
    shiftId: afternoonShift.id,
    startDate: today,
    endDate: nextMonth,
    recurrenceType: RecurrenceType.WEEKLY,
    daysOfWeek: [1, 2, 3, 4, 5],
    interval: 1,
    isActive: true,
  });

  const nightSchedule = await scheduleRepo.save({
    shiftId: nightShift.id,
    startDate: today,
    endDate: nextMonth,
    recurrenceType: RecurrenceType.WEEKLY,
    daysOfWeek: [0, 6],
    interval: 1,
    isActive: true,
  });

  console.log('✅ Schedules created');

  const users = await userRepo.find();
  const assignments: Partial<Assignment>[] = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if ([1, 2, 3, 4, 5].includes(date.getDay())) {
      assignments.push({
        scheduleId: morningSchedule.id,
        userId: users.length ? users[i % users.length].id : undefined,
        date,
        status: AssignmentStatus.ASSIGNED,
      });
    }
  }

  for (let i = 5; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if ([1, 2, 3, 4, 5].includes(date.getDay())) {
      assignments.push({
        scheduleId: afternoonSchedule.id,
        userId: undefined,
        date,
        status: AssignmentStatus.OPEN,
      });
    }
  }

  await assignmentRepo.save(assignments);

  console.log('✅ Assignments created');
  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Sample credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('User: john@example.com / user123');

  console.log('✅ Database seeding completed');
  await app.close();
}

seed();
