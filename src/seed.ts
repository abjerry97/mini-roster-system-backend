import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { AppModule } from './app/app.module';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userRepo = app.get(getRepositoryToken(User));

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
    }

    console.log('✅ Database seeding completed');
    await app.close();
}

seed();
