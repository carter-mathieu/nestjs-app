import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import argon2  from 'argon2';

@Injectable()
export class AuthService {
    //Inject prism and its services
    constructor(private prisma: PrismaService) {}

    // Define auth methods
    async signupLocal(dto: AuthDto): Promise<Tokens> {
        // hash the password
        const hashedPassword = await argon2.hash(dto.password)

        const newUser = this.prisma.user
        .create({
            data: { 
                email: dto.email,
                hash: hashedPassword,
                username: dto.username
            }
        })
    }

    signinLocal() {}

    signout() {}

    refreshTokens() {}
}