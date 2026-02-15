import {Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToMany, JoinColumn} from 'typeorm';
import{Departement} from './departement.entity';
import { Medecin } from 'src/medecin/entities/medecin.entity';

@Entity("specialites")
export class Specialite{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nom:string;

    @ManyToOne(()=>Departement, (departement)=>departement.specialites, {onDelete:"CASCADE"})
    @JoinColumn({name:"departement_id"})
    departement:Departement;

    @OneToMany(()=>Medecin, medecin=>medecin.specialite)
    medecins:Medecin[];
}