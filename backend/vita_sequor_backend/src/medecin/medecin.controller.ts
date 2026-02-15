import { Controller, Get, Param, ParseIntPipe, Post,Body,Put, Delete} from '@nestjs/common';
import { MedecinService } from './medecin.service';

@Controller('medecin')
export class MedecinController {

    constructor(
        private readonly medecinService: MedecinService
    ){}

    @Get('selectAll')
    getAllDoctors(){
        return this.medecinService.getAllDoctors();
    }

    @Get('getDeptDoctors/:deptId')
    getDeptDoctors(@Param('deptId', ParseIntPipe) deptId:number){
        return this.medecinService.getDeptDoctors(deptId);
    }

    @Post('addMedecin')
    addMedecin(@Body() body:any){
        return this.medecinService.addMedecin(body);
    }

    @Put('updateMedecin/:userId')
    updateMedecin(@Param('userId',ParseIntPipe) userId:number, @Body() body:any){
        return this.medecinService.updateMedecin(userId, body);
    }

    @Delete('deleteMedecin/:userId')
    deleteMedecin(@Param('userId', ParseIntPipe) userId:number){
        return this.medecinService.deleteMedecin(userId);
    }

}
