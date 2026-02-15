import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patients.entity';

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepo: Repository<Patient>,
    ) {}

    //POR AJOUTER UN PATIENT
    async addPatient(patient: Partial<Patient>, userId: number) {
        if (!patient.nom || !patient.prenom || !patient.telephone) {
            throw new BadRequestException("Champs obligatoires manquants (nom, prénom, téléphone)");
        }

        if (patient.cin) {
            const existingCin = await this.patientRepo.findOne({ where: { cin: patient.cin } });
            if (existingCin) throw new BadRequestException("CIN déjà utilisé !");
        }

        if (patient.email) {
            const existingEmail = await this.patientRepo.findOne({ where: { email: patient.email } });
            if (existingEmail) throw new BadRequestException("Email déjà utilisé !");
        }

        const newPatient = this.patientRepo.create({
            ...patient,
            createdBy: userId ? { id: userId } : undefined
        });

        return this.patientRepo.save(newPatient);
    }


    // RECUPERER TOUS LES PATIENTS
    async getAllPatients() {
        return this.patientRepo.find();
    }


    // RECUPERER LES PATIENTS D'UN DEPARTEMENT AVEC LE(s) MEDECIN(s) QUI LES ONT CONSULTE
    async getDeptPatients(deptId: number) {
    return this.patientRepo.find({
        where: { createdBy: { departement: { id: deptId } } },
        relations: [
            'consultations',
            'consultations.medecin',
            'consultations.medecin.user',
            'consultations.medecin.departement'
        ],
        order: { nom: 'ASC' },
    });
}


    // POUR MODIFIER UN PATIENT
    async updatePatient(id: number, data: Partial<Patient>) {
        const patient = await this.patientRepo.findOne({ where: { id } });
        if (!patient) throw new NotFoundException("Patient introuvable !");

        if (data.cin && data.cin !== patient.cin) {
            const existingCin = await this.patientRepo.findOne({ where: { cin: data.cin } });
            if (existingCin) throw new BadRequestException("CIN déjà utilisé !");
        }

        if (data.email && data.email !== patient.email) {
            const existingEmail = await this.patientRepo.findOne({ where: { email: data.email } });
            if (existingEmail) throw new BadRequestException("Email déjà utilisé !");
        }

        await this.patientRepo.update(id, data);
        const updated = await this.patientRepo.findOne({ where: { id } });
        return updated;
    }

    // POUR SUPPRIMER UN PATIENT
    async deletePatient(id: number) {
        const patient = await this.patientRepo.findOne({
            where: { id },
            relations: ['factures']
        });

        if (!patient) {
            throw new NotFoundException("Patient introuvable");
        }

        if (patient.factures && patient.factures.length > 0) {
            throw new BadRequestException(
                "Impossible de supprimer ce patient : des factures existent"
            );
        }

        await this.patientRepo.delete(patient);
    }

}
