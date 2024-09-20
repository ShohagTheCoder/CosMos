import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post()
    register(@Body() createRegisterDto: any) {
        return this.registerService.register(createRegisterDto);
    }
}
