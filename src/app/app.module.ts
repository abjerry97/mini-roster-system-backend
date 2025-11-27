import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import dbConfig from 'src/config/db.config';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ShiftModule } from 'src/shift/shift.module';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { CannotAttendModule } from 'src/cannot-attend/cannot-attend.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key', // ✅ REQUIRED
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      debug: true,
      playground: true,
    }),
    UserModule,
    ShiftModule,
    AuthModule,
    AssignmentModule,
    CannotAttendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
