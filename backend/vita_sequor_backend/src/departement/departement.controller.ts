import { Controller, Post, Body, Get, Delete, Param, Put, ParseIntPipe } from '@nestjs/common';
import { DepartementService } from './departement.service';

@Controller('departement')
export class DepartementController {
    constructor(
        private readonly departementService: DepartementService
    ){}

    //  ON FAIT LE CRUD DES DEPARTEMENTS
    @Get('allDepartments')
    getAllDepartments(){
        return this.departementService.getAllDepartments();
    }

    @Post('addDepart')
    addDepartement(@Body() body:any){
        return this.departementService.addDepartement(body.nom);
    }

    @Put('updateDepart/:id')
    updateDepart(@Param('id', ParseIntPipe) id:number, @Body() body:any){
        return this.departementService.updateDepart(id, body.nom);
    }

    @Delete('deleteDep/:id')
    deleteDepart(@Param('id') id:number){
        return this.departementService.deleteDepart(id);
    }

    // ON FAIT LE CRUD DES SPECIALITES
    @Get('allSpecialties')
    getAllSpecialties(){
        return this.departementService.getAllSpecialties();
    }

    @Post('addSpec')
    addSpecialite(@Body() body:any){
        return this.departementService.addSpecialite(body.nom, body.departementId);
    }

    @Put('updateSpec/:id')
    updateSpecialite(@Param('id', ParseIntPipe) id:number, @Body() body:any){
        return this.departementService.updateSpecialite(id, body.nom, body.departementId);
    }

    @Delete('deleteSpec/:id')
    deleteSpecialite(@Param('id') id:number){
        return this.departementService.deleteSpecialite(id);
    }

    // GET specialités d’un département précis
    @Get('specialtiesByDept/:deptId')
    getSpecialtiesByDept(@Param('deptId', ParseIntPipe) deptId: number) {
        return this.departementService.getSpecialtiesByDept(deptId);
    }

}
