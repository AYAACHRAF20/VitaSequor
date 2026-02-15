import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Conge } from './entities/conge.entity';
import { DepartementModule } from 'src/departement/departement.module';
import { Departement } from 'src/departement/entities/departement.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Conge, Departement])],
  controllers: [UserController],
  providers: [UserService, DepartementModule]
})
export class UserModule {}
