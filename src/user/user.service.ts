import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input'; 
import { hash } from 'argon2';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(id: string) {
    return await this.userRepo.findOneByOrFail({ id });
  }

  async create(createUserInput: CreateUserInput) {
    const newUser = this.userRepo.create({ uid: uuidv4(), ...createUserInput });
    newUser.password = await hash(createUserInput.password);
    return await this.userRepo.save(newUser);
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    return result.affected === 1;
  }
}
