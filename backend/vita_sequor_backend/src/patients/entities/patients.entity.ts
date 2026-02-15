import {Entity, PrimaryGeneratedColumn,CreateDateColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointments.entity';
import { Consultation } from 'src/consultations/entities/consultations.entity';
import { Facture } from 'src/facture/entities/facture.entity';
import { User } from 'src/user/entities/user.entity';

@Entity("patients")
export class Patient{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    prenom:string;

    @Column()
    nom:string;

    @Column({unique:true, nullable:true}) // L'EMAIL DOIT ETRE UNIQUE (ET IL EST AUSSI OPTIONNEL)
    email?:string;

    @Column({unique:true, nullable:true})
    cin?:string;

    @Column({type:"date"})
    date_naissance:Date;

    @Column()
    telephone:string;

    @Column({nullable:true})
    adresse?: string;

    @Column()
    genre: 'M' | 'F';

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=>User)
    createdBy:User;

    @OneToMany(()=>Appointment, (appointment)=>appointment.patient)
    appointments:Appointment[];

    @OneToMany(()=>Consultation, (consultation)=>consultation.patient)
    consultations:Consultation[];

    @OneToMany(()=>Facture, (facture)=>facture.patient)
    factures:Facture[];
}