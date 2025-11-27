import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Assignment } from './assignment.entity';
import { CannotAttend } from './cannot-attend.entity';
import { BaseTimeEntity } from './base-time.entity';
import { Role } from '../enums/role.enum';

@ObjectType()
@Entity()
export class User extends BaseTimeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Index()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  uid: string;

  @Field(() => Role)
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column()
  password: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [Assignment], { nullable: true })
  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Promise<Assignment[]>;

  @Field(() => [CannotAttend], { nullable: true })
  @OneToMany(() => CannotAttend, (ca) => ca.user)
  cannotAttend: Promise<CannotAttend[]>;
}
