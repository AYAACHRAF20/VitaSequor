import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Medecin } from './entities/medecin.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Departement } from 'src/departement/entities/departement.entity';
import { Specialite } from 'src/departement/entities/specialite.entity';

@Injectable()
export class MedecinService {
    constructor(
        @InjectRepository(Medecin)
        private readonly medecinRepo:Repository<Medecin>,

        @InjectRepository(User)
        private readonly userRepo:Repository<User>,

        @InjectRepository(Departement)
        private readonly departementRepo:Repository<Departement>,

        @InjectRepository(Specialite)
        private readonly specialiteRepo: Repository<Specialite>
    ){}

    // POUR RECUPERER TOUS LES DOCTEURS DE LA CLINIQUE
    async getAllDoctors(){
        return this.medecinRepo.find();
    }


    // POUR RECUPERER LES DOCTEURS D'UN DEPARTEMENT
    async getDeptDoctors(deptId:number){
        return this.medecinRepo.find({
            where:{
                departement:{id:deptId}
            },
            relations:['user','specialite']
        });
    }


    // POUR AJOUTER UN DOCTEUR
    async addMedecin(body: any) {
        const { prenom, nom, email, password, departementId, specialiteId } = body;

        if (await this.userRepo.findOne({ where: { email } })) {
            throw new BadRequestException('Email déjà utilisé');
        }

        if (body.password.length < 8) {
            throw new BadRequestException('Le mot de passe doit contenir au moins 8 caracteres')
        }

        const dept = await this.departementRepo.findOne({ where: { id: departementId } });
        if (!dept) throw new NotFoundException('Département introuvable');

        const spec = await this.specialiteRepo.findOne({ where: { id: specialiteId } });
        if (!spec) throw new NotFoundException('Spécialité introuvable');



        const user = this.userRepo.create({
            prenom,
            nom,
            email,
            password,
            role: UserRole.MEDECIN,
            departement: dept
        });

        const savedUser = await this.userRepo.save(user);

        const medecin = this.medecinRepo.create({
            user: savedUser,
            specialite: spec,
            departement: dept
        });

        return this.medecinRepo.save(medecin);
    }

    // POUR MODIFIER UN MEDECIN
    async updateMedecin(userId: number, body: any) {
        const { prenom, nom, email, specialiteId } = body;
        const user = await this.userRepo.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('Médecin introuvable');
        }

        if (user.role !== UserRole.MEDECIN) {
            throw new BadRequestException('Cet utilisateur n\'est pas un médecin');
        }

        user.prenom = prenom;
        user.nom = nom;
        user.email = email;

        await this.userRepo.save(user);

        const medecin = await this.medecinRepo.findOne({
            where: { user: { id: userId } },
            relations: ['user', 'specialite']
        });

        if (!medecin) {
            throw new NotFoundException('Profil médecin introuvable');
        }

        if (specialiteId) {
            const specialite = await this.specialiteRepo.findOne({
                where: { id: specialiteId }
            });

            if (!specialite) {
                throw new NotFoundException('Spécialité introuvable');
            }

            medecin.specialite = specialite;
            await this.medecinRepo.save(medecin);

            return {
                message: "Médecin mis à jour avec succès"
            };
        }
    }

    // POUR SUPPRIMER UN MEDECIN
    async deleteMedecin(userId: number) {
        const medecin = await this.medecinRepo.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });

        if (!medecin) {
            throw new NotFoundException('Médecin introuvable');
        }

        await this.medecinRepo.delete(medecin.id);

        return this.userRepo.delete(userId);
    }

    
}
