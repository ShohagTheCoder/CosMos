import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { permission } from 'process';
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
        console.log(username);
        const user = await this.usersService.findByUsername(username);

        if (user && user.password === password) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
            const { password, ...result } = user;
            console.log(result);
            return result;
        }

        throw new UnauthorizedException('Invalid username or password');
    }

    async login(user: User) {
        console.log(user);
        const payload = {
            sub: user._id, // Payload containing the user's unique ID
            permissions: user.permissions,
        };

        return new Response('Login successful')
            .data({
                access_token: this.jwtService.sign(payload),
            })
            .done();
    }
}
