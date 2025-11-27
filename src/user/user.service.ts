import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    console.log('JwtService ready:', !!jwtService);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(id: string) {
    return await this.userRepo.findOneByOrFail({ id });
  }

  async create(createUserInput: CreateUserInput) {
    const newUser = this.userRepo.create({ uid: uuidv4(), ...createUserInput });
    newUser.password = await bcrypt.hash(createUserInput.password);
    return await this.userRepo.save(newUser);
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    return result.affected === 1;
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOneBy({ email: email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compareSync(user.password, password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user,
    };
  }
}
