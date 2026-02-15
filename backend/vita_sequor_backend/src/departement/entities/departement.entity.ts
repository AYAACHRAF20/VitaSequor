import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Specialite } from "./specialite.entity";
import { User } from "src/user/entities/user.entity";
import { Medecin } from "src/medecin/entities/medecin.entity";

@Entity("departements")
export class Departement{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    nom:string;

    @OneToMany(()=>Specialite, (specialite)=>specialite.departement, {cascade:true})
    specialites:Specialite[];

    @OneToMany(()=>Medecin, medecin=>medecin.departement)
    medecins:Medecin[];

    //CA INCLUT LES SECRETAIRES ET LES ADMINS DES DEPARTEMENTS
    @OneToMany(()=>User, user=>user.departement)
    membres:User[];
}