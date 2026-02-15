import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import { Consultation } from "./consultations.entity";

@Entity("prescriptions")
export class Prescription{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Consultation, (consultation)=>consultation.prescriptions, {onDelete:"CASCADE"})
    @JoinColumn({name:"consultation_id"})
    consultation: Consultation;

    @Column({type:"text"})
    medicament:string;

    @Column({type:"text"})
    posologie:string;

    @Column({nullable:true})
    duree?:string;

    @CreateDateColumn()
    createdAt:Date;
}