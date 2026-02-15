import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Get('all')
    getAllPatients() {
        return this.patientsService.getAllPatients();
    }

    @Get('getDeptPatients/:deptId')
    getDeptPatients(@Param('deptId', ParseIntPipe) deptId: number) {
        return this.patientsService.getDeptPatients(deptId);
    }

    @Post('addPatient')
    addPatient(@Body() patientData: any) {
        const userId = patientData.createdBy?.id;
        return this.patientsService.addPatient(patientData, userId);
    }

    @Put('updatePatient/:id')
    updatePatient(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.patientsService.updatePatient(id, data);
    }

    @Delete('deletePatient/:id')
    deletePatient(@Param('id', ParseIntPipe) id: number) {
        return this.patientsService.deletePatient(id);
    }
}
