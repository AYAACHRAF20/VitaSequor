import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entities/consultations.entity';
import { Prescription } from './entities/prescription.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Consultation, Prescription])],
  controllers: [ConsultationsController],
  providers: [ConsultationsService]
})
export class ConsultationsModule {}
