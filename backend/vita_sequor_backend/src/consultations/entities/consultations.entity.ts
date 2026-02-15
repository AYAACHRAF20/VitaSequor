import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from "typeorm";
import { Patient } from "src/patients/entities/patients.entity";
import { Medecin } from "src/medecin/entities/medecin.entity";
import { Prescription } from "./prescription.entity";

@Entity("consultations")
export class Consultation{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Patient, (patient)=>patient.consultations, {onDelete:"CASCADE"})
    @JoinColumn({name:"patient_id"})
    patient:Patient;

    @ManyToOne(()=>Medecin, medecin=>medecin.consultations,{onDelete:"SET NULL", nullable:true})
    @JoinColumn({name:"medecin_id"})
    medecin: Medecin;

    @Column({type:"date"})
    date:Date;

    @Column({type:"text"})
    diagnostic:string;

    @Column({type:"text", nullable:true})
    notes?:string;

    @OneToMany(()=>Prescription, (prescription)=>prescription.consultation, {cascade:true})
    prescriptions:Prescription[];

    @CreateDateColumn()
    createdAt:Date;
}