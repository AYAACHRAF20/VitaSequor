import { Departement } from "src/departement/entities/departement.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Medecin } from "src/medecin/entities/medecin.entity";

// CELA MONTRE LES ROLES POSSIBLES DANS CE PROJET CONCERNANT UN CABINET MEDICAL MULTIDISCIPINAIRE/MINI-CLINIQUE
export enum UserRole{
    ADMIN_CLINIQUE="ADMIN_CLINIQUE",
    ADMIN_DEPT="ADMIN_DEPT",
    MEDECIN="MEDECIN",
    SECRETARY="SECRETARY"
}

@Entity("users")
export class User{
    //ID UNIQUE DE CHAQUE UTILISATEUR
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    prenom:string;    // PRENOM

    @Column()
    nom:string;      // NOM

    @Column({unique:true})  // L'EMAIL DOIT ETRE UNIQUE
    email:string;

    @Column() 
    password:string;

    @Column({
        type:"enum",
        enum:UserRole,
        default:UserRole.SECRETARY      // LE ROLE EST "SECRETARY" PAR DEFAUT
    })
    role:UserRole;

    @CreateDateColumn()
    createdAt: Date;       // DATE DE CREATION OU D'AJOUT D'UN UTILISATEUR

    //ON ASSIGNE A UN DEPARTEMENT SI C'EST UN ADMIN DE DEPARTEMENT OU SECRETAIRE
    @ManyToOne(()=>Departement, departement=>departement.membres ,{nullable:true, onDelete:'SET NULL'})
    @JoinColumn({name:"departement_id"})
    departement:Departement;

    //ON MET LE LIEN VERS UN PROFIL MEDECIN SI C'EST UN MEDECIN
    @OneToOne(()=>Medecin, medecin=>medecin.user)
    medecinProfil?:Medecin;
}