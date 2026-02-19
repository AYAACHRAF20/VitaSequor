import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Facture, FactureStatus } from './entities/facture.entity';
import { Patient } from 'src/patients/entities/patients.entity';

@Injectable()
export class FactureService {
    constructor(
        @InjectRepository(Facture)
        private readonly factureRepo: Repository<Facture>,
        
        @InjectRepository(Patient)
        private readonly patientRepo:Repository<Patient>
    ){}


    // CALCULER LES REVENUS MENSUELS DE LA CLINIQUE
    async calculMonthlyIncome() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const factures = await this.factureRepo.find();

        const total = factures
            .filter(facture => {
                if (!facture.date) return false;

                const dateFacture = new Date(facture.date);
                if (isNaN(dateFacture.getTime())) return false;

                return (
                    dateFacture.getMonth() === currentMonth &&
                    dateFacture.getFullYear() === currentYear
                );
            })
            .reduce(
                (acc, facture) => acc + Number(facture.montant),
                0
            );

        return total;
    }


    // RECUPERER LES FACTURES SELON LES FILTRES
    async getFacturesFiltered(filters:any){
        const factures:any={};

        if(filters.dateDebut && filters.dateFin){
            factures.date=Between(filters.dateDebut,filters.dateFin);
        }else if(filters.dateDebut){
            factures.date=Between(filters.dateDebut,new Date());
        }else if(filters.dateFin){
            factures.date=Between(new Date('2025-12-31'),filters.dateFin);
        }

        if(filters.statut) factures.status=filters.statut;
        if(filters.paymentMode) factures.modePaiement=filters.paymentMode;

        return this.factureRepo.find({
            where:factures,
            relations:['patient']
        });
    }


    // RECUPERER LES REVENUS MENSUELS D'UN DEPARTEMENT
    async getDeptMonthlyIncome(deptId:number){
        const today=new Date();
        const currentMonth=today.getMonth()+1;
        const currentYear=today.getFullYear();

        const factures=await this.factureRepo
            .createQueryBuilder('facture')
            .leftJoin('facture.patient','patient')
            .leftJoin('patient.createdBy','user')
            .leftJoin('user.departement','departement')
            .where('departement.id=:deptId',{deptId})
            .andWhere('facture.status=:status',{status:FactureStatus.PAYEE})
            .getMany()
        ;
        const total=factures.filter(facture=>{
            const date=new Date(facture.date);
            return date.getMonth()+1 ===currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((acc,facture)=>acc+Number(facture.montant), 0);

        return total;
    }


    // RECUPERER LES FACTURES EN ATTENTE DANS UN DEPARTEMENT
    async getDeptFacturesAttente(deptId:number){
        return this.factureRepo
            .createQueryBuilder('facture')
            .leftJoin('facture.patient','patient')
            .leftJoin('patient.createdBy','user')
            .leftJoin('user.departement','departement')
            .where('departement.id=:deptId',{deptId})
            .andWhere('facture.status=:status',{status:FactureStatus.EN_ATTENTE})
            .getMany()
        ;
    }


    // RECUPERER LES FACTURES D'UN DEPARTEMENT
    async getDeptFactures(deptId: number){
        return this.factureRepo
            .createQueryBuilder('facture')
            .leftJoinAndSelect('facture.patient', 'patient')
            .leftJoinAndSelect('patient.consultations', 'consultation')
            .leftJoinAndSelect('consultation.medecin', 'medecin')
            .leftJoinAndSelect('medecin.departement', 'departement')
            .where('departement.id = :deptId', { deptId })
            .distinct(true)
            .orderBy('facture.date', 'DESC')
            .getMany()
        ;
    }


    // RECUPERER LES FACTURES DU DEPARTEMENT SELON LES FILTRES
    async getDeptFacturesFiltered(deptId: number, filters: any) {
        const query = this.factureRepo
            .createQueryBuilder('facture')
            .leftJoinAndSelect('facture.patient', 'patient')
            .leftJoin('patient.createdBy', 'user')
            .leftJoin('user.departement', 'departement')
            .where('departement.id = :deptId', { deptId });

        // DANS UNE PERIODE 
        if (filters.dateDebut && filters.dateFin) {
            query.andWhere('facture.date BETWEEN :start AND :end', { start: filters.dateDebut, end: filters.dateFin });
        } else if (filters.dateDebut) {
            query.andWhere('facture.date >= :start', { start: filters.dateDebut });
        } else if (filters.dateFin) {
            query.andWhere('facture.date <= :end', { end: filters.dateFin });
        }

        // SELON LE STATUT DE LA FACTURE
        if (filters.statut) {
            query.andWhere('facture.status = :status', { status: filters.statut });
        }

        // SELON LE MODE DE PAIMENT DE LA FACTURE
        if (filters.paymentMode) {
            query.andWhere('facture.modePaiement = :mode', { mode: filters.paymentMode });
        }

        return query.orderBy('facture.date', 'DESC').getMany();
    }


    // POUR AJOUTER UNE FACTURE
    async addFacture(data: Partial<Facture>): Promise<Facture> {
        if (!data.patient?.id) throw new BadRequestException("Patient requis");
        if (!data.montant || data.montant <= 0) throw new BadRequestException("Montant invalide");

        const patient = await this.patientRepo.findOne({ where: { id: data.patient.id } });
        if (!patient) throw new NotFoundException("Patient introuvable");

        const factureData: Partial<Facture> = {
            patient,
            montant: data.montant,
            status: data.status || FactureStatus.EN_ATTENTE,
            modePaiement: data.modePaiement ?? undefined,
            date: data.date || new Date()
        };

        const facture = this.factureRepo.create(factureData);
        return this.factureRepo.save(facture);
    }

    // POUR MODIFIER UNE FACTURE
    async updateFacture(id: number, status: FactureStatus): Promise<Facture> {
        const facture = await this.factureRepo.findOne({ where: { id }, relations: ['patient'] });
        if (!facture) throw new NotFoundException("Facture non trouvée");

        facture.status = status;
        return this.factureRepo.save(facture);
    }


    // POUR SUPPRIMER UNE FACTURE
    async deleteFacture(id: number): Promise<void> {
        const facture = await this.factureRepo.findOne({ where: { id } });
        if (!facture) throw new NotFoundException("Facture non trouvée");

        await this.factureRepo.delete(facture);
    }
}
