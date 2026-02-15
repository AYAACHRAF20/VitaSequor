import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    //FONCTION QUI GERE LA CONNEXION COTE BACKEND
    async login(email:string, password:string){
        const userExists=await this.userRepo.findOne({
            where:{email},
            relations:['departement']
        });

        if(!userExists){
            return{
                success:false,
                message:"Utilisateur introuvable!"
            };
        }

        if(!(userExists.password===password)){
            return{
                success:false,
                message:"mot de passe incorrect!"
            };
        }
        

        return{
            success:true,
            message:"Connexion réussie!",
            user:{
                id:userExists.id,
                prenom:userExists.prenom,
                nom:userExists.nom,
                email:userExists.email,
                role:userExists.role,
                departement:userExists.departement
            }
        }
    }
}
