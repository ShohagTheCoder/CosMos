import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'crypto';
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
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException('Invalid username or password');
    }

    async login(user: any) {
        const payload = {
            username: user.name,
            sub: user.userId,
            canSell: user.canSell,
            verify: user.verify,
        };
        return { access_token: this.jwtService.sign(payload) };
    }
}
