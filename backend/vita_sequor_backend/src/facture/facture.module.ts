import { Module } from '@nestjs/common';
import { FactureController } from './facture.controller';
import { FactureService } from './facture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from './entities/facture.entity';
import { Patient } from 'src/patients/entities/patients.entity';
import { Medecin } from 'src/medecin/entities/medecin.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Facture,Patient,Medecin])],
  controllers: [FactureController],
  providers: [FactureService]
})
export class FactureModule {}
