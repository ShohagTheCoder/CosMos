import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Response } from 'src/common/utils/apiResponse';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);

        if (user && user.password === password) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException('Invalid username or password');
    }

    async login(user: User) {
        const payload = {
            sub: user._id, // Payload containing the user's unique ID
        };

        return new Response('Login successful').data({
            access_token: this.jwtService.sign(payload),
        });
    }
}
