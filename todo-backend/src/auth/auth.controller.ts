import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { SigninDto } from './dto/auth.dto';
import { Public } from './decorator/auth.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('/register')
    @ApiCreatedResponse({
        description: 'register user',
    })
    async register(@Body() createUser: CreateUserDto) {
        const res = await this.authService.register(createUser);
        return res;
    }

    @Public()
    @Post('/signin')
    @ApiCreatedResponse({
        description: 'user sign in',
    })
    async signIn(@Body() payload: SigninDto){
        console.log("signin",payload);
        const res = await this.authService.signIn(payload);
        return res;
    }
}
