import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patients.entity';




@Module({
  imports:[TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService]
})
export class PatientsModule {}
