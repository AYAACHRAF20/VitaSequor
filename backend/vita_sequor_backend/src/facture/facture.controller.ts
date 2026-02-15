import { Controller, Get, Post, Body, Param, ParseIntPipe, Delete, Put } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureStatus } from './entities/facture.entity';

@Controller('facture')
export class FactureController {
    constructor(private readonly factureService: FactureService) {}

    // ======================================
    // Revenus mensuels globaux
    // ======================================
    @Get('revenus')
    getMonthlyRevenus() {
        return this.factureService.calculMonthlyIncome();
    }

    // ======================================
    // Filtrer toutes les factures
    // ======================================
    @Post('selectAll')
    getFacturesFiltered(@Body() filters: any) {
        return this.factureService.getFacturesFiltered(filters);
    }

    // ======================================
    // Factures d’un département
    // ======================================
    @Get('getDeptFactures/:deptId')
    getDeptFactures(@Param('deptId', ParseIntPipe) deptId: number) {
        return this.factureService.getDeptFactures(deptId);
    }

    @Get('getDeptFacturesAttente/:deptId')
    getDeptFacturesAttente(@Param('deptId', ParseIntPipe) deptId: number) {
        // On pourrait créer une méthode dédiée si besoin
        return this.factureService.getDeptFacturesFiltered(deptId, { statut: FactureStatus.EN_ATTENTE });
    }

    @Post('selectDeptFactures/:deptId')
    selectDeptFactures(
        @Param('deptId', ParseIntPipe) deptId: number,
        @Body() filters: any
    ) {
        return this.factureService.getDeptFacturesFiltered(deptId, filters);
    }

    @Get('getDeptMonthlyIncome/:deptId')
    getDeptMonthlyIncome(@Param('deptId', ParseIntPipe) deptId: number) {
        // Si tu veux un calcul spécifique par département, il faut créer une méthode dédiée
        return this.factureService.calculMonthlyIncome();
    }

    // ======================================
    // Ajouter une facture
    // ======================================
    @Post('addFacture')
    addFacture(@Body() data: any) {
        return this.factureService.addFacture(data);
    }

    // ======================================
    // Mettre à jour toutes les propriétés d’une facture
    // ======================================
    @Put('updateFacture/:id')
    updateFacture(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any
    ) {
        return this.factureService.updateFacture(id, data);
    }

    // ======================================
    // Supprimer une facture
    // ======================================
    @Delete('deleteFacture/:id')
    deleteFacture(@Param('id', ParseIntPipe) id: number) {
        return this.factureService.deleteFacture(id);
    }
}
