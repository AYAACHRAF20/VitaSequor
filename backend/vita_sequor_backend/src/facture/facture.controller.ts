import { Controller, Get, Post, Body, Param, ParseIntPipe, Delete, Put } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureStatus } from './entities/facture.entity';

@Controller('facture')
export class FactureController {
    constructor(private readonly factureService: FactureService) {}

    // REVENUS MENSUELS DE LA CLINIQUE 
    @Get('revenus')
    getMonthlyRevenus() {
        return this.factureService.calculMonthlyIncome();
    }

    // FILTRER TOUTES LES FACTURES
    @Post('selectAll')
    getFacturesFiltered(@Body() filters: any) {
        return this.factureService.getFacturesFiltered(filters);
    }


    // FACTURES D'UN DEPARTEMENT
    @Get('getDeptFactures/:deptId')
    getDeptFactures(@Param('deptId', ParseIntPipe) deptId: number) {
        return this.factureService.getDeptFactures(deptId);
    }

    // RECUPERER LES FACTURES EN ATTENTE DU DEPARTEMENT
    @Get('getDeptFacturesAttente/:deptId')
    getDeptFacturesAttente(@Param('deptId', ParseIntPipe) deptId: number) {
        return this.factureService.getDeptFacturesFiltered(deptId, { statut: FactureStatus.EN_ATTENTE });
    }

    // RECUPERER LES FACTURES DU DEPARTEMENT 
    @Post('selectDeptFactures/:deptId')
    selectDeptFactures(@Param('deptId', ParseIntPipe) deptId: number, @Body() filters: any) {
        return this.factureService.getDeptFacturesFiltered(deptId, filters);
    }

    // RECUPERER LES REVENUS MENSUELS D'UN CERTAIN DEPARTEMENT 
    @Get('getDeptMonthlyIncome/:deptId')
    getDeptMonthlyIncome(@Param('deptId', ParseIntPipe) deptId: number) {
        return this.factureService.getDeptMonthlyIncome(deptId);
    }


    // AJOUTER UNE FACTURE
    @Post('addFacture')
    addFacture(@Body() data: any) {
        return this.factureService.addFacture(data);
    }

    // MODIFIER UNE FACTURE
    @Put('updateFacture/:id')
    updateFacture(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any
    ) {
        return this.factureService.updateFacture(id, data);
    }


    // SUPPRIMER UNE FACTURE
    @Delete('deleteFacture/:id')
    deleteFacture(@Param('id', ParseIntPipe) id: number) {
        return this.factureService.deleteFacture(id);
    }
}
