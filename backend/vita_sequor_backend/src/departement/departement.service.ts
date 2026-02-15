import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Departement } from './entities/departement.entity';
import { Specialite } from './entities/specialite.entity';


@Injectable()
export class DepartementService {
    constructor(
        @InjectRepository(Departement)
        private readonly departementRepo: Repository<Departement>,

        @InjectRepository(Specialite)
        private readonly specialiteRepo: Repository<Specialite>
    ) {}

    // PARTIE 1: GESTION DES DEPARTEMENTS

    // RECUPERER TOUS LES DEPARTEMENTS
    async getAllDepartments() {
        return this.departementRepo.find({
            relations: ['membres', 'specialites']
        });
    }


    // AJOUTER UN DEPARTEMENT
    async addDepartement(nom: string) {
        const depExists = await this.departementRepo.findOne({
            where: { nom }
        });

        if (depExists) {
            throw new BadRequestException(`Le departement ${nom} existe deja!`);
        }

        const departement = this.departementRepo.create({ nom });
        return this.departementRepo.save(departement);
    }


    // MODIFIER UN DEPARTEMENT
    async updateDepart(id: number, nom: string) {
        const departement = await this.departementRepo.findOne({
            where: { id }
        });

        if (!departement) {
            throw new NotFoundException("Departement introuvable!");
        }

        const memeNom = await this.departementRepo.findOne({
            where: { nom }
        });

        if (memeNom && memeNom.id !== id) {
            throw new BadRequestException(`un autre departement porte deja le nom ${nom}!`);
        }

        departement.nom = nom;
        return this.departementRepo.save(departement);
    }

    async deleteDepart(id: number) {
        return this.departementRepo.delete(id);
    }

    // PARTIE 2: GESTION DU CRUD DES SPECIALITES


    // RECUPERER TOUTES LES SPECIALITES
    async getAllSpecialties() {
        return this.specialiteRepo.find({
            relations: ['departement', 'medecins']
        });
    }


    // AJOUTER UNE SPECIALITE
    async addSpecialite(nom: string, departementId: number) {
        const specExists = await this.specialiteRepo.findOne({
            where: { nom, departement: { id: departementId } },
            relations: ['departement']
        });

        if (specExists) {
            throw new BadRequestException(`La spécialité "${nom}" existe déjà dans le département ${specExists.departement.nom}`);
        }

        const departement = await this.departementRepo.findOne({
            where: { id: departementId }
        });

        if (!departement) {
            throw new NotFoundException("Departement introuvable!");
        }

        const specialite = this.specialiteRepo.create({ nom, departement });
        return this.specialiteRepo.save(specialite);
    }


    // MODIFIER UNE SPECIALITE
    async updateSpecialite(id: number, nom: string, departementId: number) {
        const specialite = await this.specialiteRepo.findOne({
            where: { id },
            relations: ['departement']
        });

        if (!specialite) {
            throw new NotFoundException("Specialite introuvable!");
        }

        // Vérifier si le nom est pris par une AUTRE spécialité
        const specExists = await this.specialiteRepo.findOne({
            where: { nom }
        });

        if (specExists && specExists.id !== id) {
            throw new BadRequestException(`la specialite "${nom}" existe deja!`);
        }

        const departement = await this.departementRepo.findOne({
            where: { id: departementId }
        });

        if (!departement) {
            throw new NotFoundException("Departement introuvable!");
        }

        specialite.nom = nom;
        specialite.departement = departement;

        return this.specialiteRepo.save(specialite);
    }


    // SUPPRIMER UNE SPECIALITE
    async deleteSpecialite(id: number) {
        return this.specialiteRepo.delete(id);
    }

    // RECUPERER LES SPECIALITES PAR DEPARTEMENT
    async getSpecialtiesByDept(deptId: number) {
        const dept = await this.departementRepo.findOne({
            where: { id: deptId },
            relations: ['specialites']
        });
        if (!dept) throw new NotFoundException("Département introuvable");
        return dept.specialites;
    }

}