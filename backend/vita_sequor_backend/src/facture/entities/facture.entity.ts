import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Patient } from "src/patients/entities/patients.entity";

export enum FactureStatus {
    PAYEE = "PAYEE",
    EN_ATTENTE = "EN_ATTENTE",
    ANNULEE = "ANNULEE"
}

export enum ModePaiement {
    ESPECES = "ESPECES",
    CARTE = "CARTE",
    VIREMENT = "VIREMENT",
    CHEQUE = "CHEQUE"
}

@Entity("factures")
export class Facture {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Patient, (patient) => patient.factures)
    @JoinColumn({ name: "patient_id" })
    patient: Patient;

    @CreateDateColumn({type:"date"})
    date:Date;

    @Column({ type: "numeric" })
    montant: number;

    @Column({
        type: "enum",
        enum: FactureStatus,
        default: FactureStatus.EN_ATTENTE
    })
    status: FactureStatus;

    @Column({
        type: "enum",
        enum: ModePaiement,
        nullable: true 
    })
    modePaiement?: ModePaiement;

    @CreateDateColumn()
    createdAt: Date;
}
