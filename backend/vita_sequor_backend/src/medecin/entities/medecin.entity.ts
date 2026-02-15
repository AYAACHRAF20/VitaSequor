import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Specialite } from "src/departement/entities/specialite.entity";
import { Departement } from "src/departement/entities/departement.entity";
import { Appointment } from "src/appointments/entities/appointments.entity";
import { Consultation } from "src/consultations/entities/consultations.entity";

@Entity("medecins")
export class Medecin{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(()=>User, user=>user.medecinProfil ,{onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:User;

    @ManyToOne(()=>Specialite, specialite=>specialite.medecins, {nullable:false})
    @JoinColumn({name:"specialite_id"})
    specialite:Specialite;

    @ManyToOne(()=>Departement, departement=>departement.medecins, {nullable:false})
    @JoinColumn({name:"departement_id"})
    departement:Departement;

    @OneToMany(()=>Appointment, appointment=>appointment.medecin)
    appointments:Appointment[];

    @OneToMany(()=>Consultation, consultation=>consultation.medecin)
    consultations:Consultation[];
}