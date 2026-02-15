import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementModule } from './departement/departement.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { FactureModule } from './facture/facture.module';
import { MedecinModule } from './medecin/medecin.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password:'postgres',
      database:'vitaDB',
      autoLoadEntities:true,
      synchronize:true
    })
    ,AuthModule, UserModule, DepartementModule, PatientsModule, AppointmentsModule, ConsultationsModule, FactureModule, MedecinModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
