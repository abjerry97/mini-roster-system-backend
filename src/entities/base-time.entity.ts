import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field } from '@nestjs/graphql';

export abstract class BaseTimeEntity {
  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
