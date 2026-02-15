import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Patch, Query} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentStatus } from './entities/appointments.entity';

@Controller('appointments')
export class AppointmentsController {

    constructor(
        private readonly appointService:AppointmentsService
    ){}

    @Get('forToday')
    getTodayAppointments(){
        return this.appointService.getTodayAppointments();
    }

    @Get('waitingAppointments')
    getWaitingAppointments(){
        return this.appointService.getWaitingAppointments();
    }

    @Get('getCompletedAppoints')
    getCompletedAppointments(){
        return this.appointService.getCompletedAppointments();
    }

    @Get('all')
    getAll() {
        return this.appointService.getAll();
    }

    @Post('add')
    add(@Body() body:any) {
        return this.appointService.addAppointment(body);
    }

    @Put('update/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Appointment>) {
        return this.appointService.updateAppointment(id, body);
    }

    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.appointService.deleteAppointment(id);
    }

    @Get("getDeptAppointments/:deptId")
    getDeptAppointments(@Param("deptId", ParseIntPipe) deptId: number) {
        return this.appointService.getDeptAppointments(deptId);
    }

    @Patch('updateStatus/:id')
    updateStatus(@Param('id', ParseIntPipe) id:number, @Body() body:{status:AppointmentStatus}){
        return this.appointService.updateStatus(id, body.status);
    }

    @Get('disponibilites/:medecinId/:date')
    getDisponibilites(@Param('medecinId', ParseIntPipe) medecinId: number, @Param('date') date: string) {
        return this.appointService.getDisponibilites(medecinId, date);
    }
}
