import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller('vita')
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly authService:AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body() body: {email:string, password:string}){
    return this.authService.login(body.email, body.password);
  }
}
