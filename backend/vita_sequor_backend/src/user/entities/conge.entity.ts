import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum CongeStatus{
    EN_ATTENTE="EN_ATTENTE",
    APPROUVE="APPROUVE",
    REFUSE="REFUSE"
}

@Entity("conges")
export class Conge{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>User, {onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:User;

    @Column({type:"date"})
    dateDebut:Date;

    @Column({type:"date"})
    dateFin:Date;

    @Column({nullable:true})
    motif?:string;

    @Column({
        type:"enum",
        enum:CongeStatus,
        default:CongeStatus.EN_ATTENTE
    })
    status:CongeStatus;

    @CreateDateColumn()
    createdAt:Date;
}