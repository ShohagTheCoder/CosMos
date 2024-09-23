import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
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

    async login(user: User): Promise<ApiResponse<{ access_token: string }>> {
        const payload = {
            sub: user._id, // Payload containing the user's unique ID
        };

        return {
            status: 'success', // Indicating a successful login
            code: 200, // HTTP status code
            message: 'Login successful', // Descriptive message
            data: {
                access_token: this.jwtService.sign(payload), // Access token as data
            },
            timestamp: new Date().toISOString(), // Optional timestamp for the event
            path: '/auth/login', // Optional path (useful for tracking)
        };
    }
}
