import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get('selectAllSecretaries')
    getAllSecretaries(){
        return this.userService.getAllSecretaries();
    }

    @Get('AllAdmins')
    getAllAdmins(){
        return this.userService.getAllDeptAdmins();
    }

    @Post('addAdmin')
    addAdmin(@Body() body:{prenom:string, nom:string, email:string, password:string, departementId:number}){
        return this.userService.addDeptAdmin(body.prenom, body.nom, body.email, body.password, body.departementId);
    }

    @Put('updateAdmin/:id')
    updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() body:{prenom:string, nom:string, email:string, password?:string, departementId?:number}){
        return this.userService.updateDeptAdmin(id, body.prenom, body.nom, body.email, body.password, body.departementId);
    }

    @Delete('deleteAdmin/:id')
    deleteAdmin(@Param('id', ParseIntPipe) id:number){
        return this.userService.deleteDeptAdmin(id);
    }

    @Get('getDeptSecretaries/:deptId')
    getDeptSecretaries(@Param('deptId', ParseIntPipe) deptId:number){
        return this.userService.getDeptSecretaries(deptId);
    }

    @Post('addSecretary')
    addSecretary(@Body() body:any){
        return this.userService.addSecretary(body);
    }

    @Put('updateSecretary/:id')
    updateSecretary(@Param('id', ParseIntPipe) id:number, @Body() body:any){
        return this.userService.updateSecretary(id, body);
    }

    @Delete('deleteSecretary/:id')
    deleteSecretary(@Param('id', ParseIntPipe) id:number){
        return this.userService.deleteSecretary(id);
    }
}
