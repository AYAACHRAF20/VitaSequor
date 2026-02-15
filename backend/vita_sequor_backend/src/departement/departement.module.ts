import { Module } from '@nestjs/common';
import { DepartementController } from './departement.controller';
import { DepartementService } from './departement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departement } from './entities/departement.entity';
import { Specialite } from './entities/specialite.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Departement, Specialite])],
  controllers: [DepartementController],
  providers: [DepartementService]
})
export class DepartementModule {}
