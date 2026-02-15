import { Module } from '@nestjs/common';
import { MedecinController } from './medecin.controller';
import { MedecinService } from './medecin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medecin } from './entities/medecin.entity';
import { User } from 'src/user/entities/user.entity';
import { Departement } from 'src/departement/entities/departement.entity';
import { Specialite } from 'src/departement/entities/specialite.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Medecin, User, Departement, Specialite])],
  controllers: [MedecinController],
  providers: [MedecinService]
})
export class MedecinModule {}
