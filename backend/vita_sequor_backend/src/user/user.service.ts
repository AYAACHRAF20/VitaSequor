import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Conge } from './entities/conge.entity';
import { Departement } from 'src/departement/entities/departement.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo:Repository<User>,

        @InjectRepository(Conge)
        private readonly congeRepo:Repository<Conge>,

        @InjectRepository(Departement)
        private readonly departementRepo:Repository<Departement>
    ){}

    // POUR RECUPERER TOUTES LES SECRETAIRES
    async getAllSecretaries(){
        return this.userRepo.find({where: {role:UserRole.SECRETARY}});
    }


    // POUR RECUPERER TOUS LES ADMINS DES DEPARTEMENTS
    async getAllDeptAdmins(){
        return this.userRepo.find({
            where:{
                role:UserRole.ADMIN_DEPT
            },
            relations:['departement']
        });
    }

    async addDeptAdmin(prenom: string, nom: string, email: string, password: string, departementId: number) {
        const userExists = await this.userRepo.findOne({ where: { email } });
        if (userExists) {
            throw new BadRequestException(`L'email ${email} est déjà utilisé !`);
        }

        if (password.length < 8) {
            throw new BadRequestException('Le mot de passe doit contenir au moins 8 caracteres');
        }

        const departement = await this.departementRepo.findOne({ where: { id: departementId } });
        if (!departement) {
            throw new NotFoundException(`Département introuvable !`);
        }

        const existingAdmin = await this.userRepo.findOne({
            where: {
                role: UserRole.ADMIN_DEPT,
                departement: { id: departementId }
            }
        });

        if (existingAdmin) {
            throw new BadRequestException(`Le département ${departement.nom} a déjà un admin!`);
        }

        const admin = this.userRepo.create({
            prenom,
            nom,
            email,
            password,
            role: UserRole.ADMIN_DEPT,
            departement
        });
        return await this.userRepo.save(admin);
    }

        // POUR MODIFIER UN ADMIN DE DEPARTEMENT
    async updateDeptAdmin(id: number, prenom: string, nom: string, email: string, password?: string, departementId?: number) {
        const admin = await this.userRepo.findOne({
            where: { id, role: UserRole.ADMIN_DEPT },
            relations: ['departement']
        });

        if (!admin) {
            throw new NotFoundException("Admin de departement introuvable!");
        }

        const adminId = Number(id);
        const emailExists = await this.userRepo.findOne({ where: { email } });
        if (emailExists && Number(emailExists.id) !== adminId) {
            throw new BadRequestException(`L'email "${email}" est deja utilise!`);
        }

        admin.prenom = prenom;
        admin.nom = nom;
        admin.email = email;
        if (password) {
            admin.password = password;
        }

        if (departementId && departementId !== admin.departement?.id) {
            const newDepart = await this.departementRepo.findOne({
                where: { id: departementId }
            });

            if (!newDepart) {
                throw new NotFoundException("Departement introuvable!");
            }
            //ON VERIFIE SI EXISTE DEJA UN AUTRE ADMIN DANS CE DEPARTEMENT
            const adminDejaDansDept = await this.userRepo.findOne({
                where: {
                    role: UserRole.ADMIN_DEPT,
                    departement: { id: departementId }
                },
                relations: ['departement']
            });

            if (adminDejaDansDept && adminDejaDansDept.id !== id) {
                throw new BadRequestException(`Le departement ${newDepart.nom} a deja un admin!`);
            }

            admin.departement = newDepart;
            return await this.userRepo.save(admin);
        }
    }

    // POUR SUPPRIMER UN ADMIN DE DEPARTEMENT
    async deleteDeptAdmin(id:number){
        return this.userRepo.delete({id, role:UserRole.ADMIN_DEPT});
    }

    
    // POUR RECUPERER LES SECRETAIRES DU DEPARTEMENT
    async getDeptSecretaries(deptId:number){
        return this.userRepo.find({
            where:{
                departement:{id:deptId},
                role:UserRole.SECRETARY
            },
            relations:['departement']
        });
    }
    //POUR AJOUTER UNE SECRETAIRE
    async addSecretary(body:any){
        const {prenom, nom, email, password, departementId}=body;

        const userExists=await this.userRepo.findOne({
            where:{email}
        });

        if(userExists){
            throw new BadRequestException('Email deja utilise!');
        }

        const dept=await this.departementRepo.findOne({
            where:{id: departementId}
        });

        if(!dept) throw new NotFoundException('Departement introuvable');
        const secretaire=this.userRepo.create({
            prenom,
            nom,
            email,
            password,
            role:UserRole.SECRETARY,
            departement:dept
        });

        return this.userRepo.save(secretaire);
    }

    // POUR MODIFIER UNE SECRETAIRE
    async updateSecretary(id:number, body:any){
        const secretaire=await this.userRepo.findOne({
            where:{id}
        });

        if(!secretaire) throw new NotFoundException('Secretaire introuvable');

        secretaire.prenom=body.prenom;
        secretaire.nom=body.nom;
        secretaire.email=body.email;

        return this.userRepo.save(secretaire);
    }

    // POUR SUPPRIMER UNE SECRETAIRE
    async deleteSecretary(id:number){
        return this.userRepo.delete(id);
    }

    
}
