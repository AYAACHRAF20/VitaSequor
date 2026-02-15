import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Patient } from "src/patients/entities/patients.entity";
import { Medecin } from "src/medecin/entities/medecin.entity";

export enum AppointmentStatus{
    EN_ATTENTE="EN_ATTENTE",
    FAIT="FAIT",
    ANNULE="ANNULE"
}

@Entity("appointments")
export class Appointment{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Patient, (patient)=>patient.appointments, {onDelete:"CASCADE"})
    @JoinColumn({name:"patient_id"})
    patient:Patient;

    @ManyToOne(()=>Medecin, (medecin)=>medecin.appointments, {onDelete:"SET NULL", nullable:true})
    @JoinColumn({name:"medecin_id"})
    medecin:Medecin;

    @Column({type:"timestamp"})
    datetime:Date;

    @Column({
        type:"enum",
        enum:AppointmentStatus,
        default:AppointmentStatus.EN_ATTENTE
    })
    status:AppointmentStatus;

    @Column({ type: "text", nullable: true })
    motif: string;

    @CreateDateColumn()
    createdAt:Date;
}