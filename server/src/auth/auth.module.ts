import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from './secret.key';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { UserSchema } from 'src/users/schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: SECRET,
            signOptions: { expiresIn: '12h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
