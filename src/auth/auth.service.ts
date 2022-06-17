import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
    //Inject prism and its services
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    // Helper function to get the tokens and sign the user id and email
    async getTokens(userId: number, email: string) {
        const [at, rt] = await Promise.all([
            // Sign the access token to at in Promise
            this.jwtService.signAsync({
                sub: userId,
                email: email
            }, {
                // Set the secret as the secret on the AtStrategy
                secret: "at-secret",
                // Provide token configurations as second arg
                expiresIn: 60 * 15 // 15 min
            }),
            // Sign the refresh token to rt in Promise
            this.jwtService.signAsync({
                sub: userId,
                email: email
            }, {
                // Set the secret as the secret on the RtStrategy
                secret: "rt-secret",
                // Provide token configurations as second arg
                expiresIn: 60 * 60 * 24 * 7 // 1 week
            })
        ]);
        return {
            access_token: at,
            refresh_token: rt
        }   
    }

    // Helper function for hashing the rt in db
    async updateRtToken(userId: number, rt: string) {
        const hashedToken = await argon2.hash(rt)
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRefreshToken: hashedToken
            }
        })
    }

    // Define auth methods
    async signupLocal(dto: AuthDto): Promise<Tokens> {
        // hash the password
        const hashedPassword = await argon2.hash(dto.password)

        const newUser = await this.prisma.user
        .create({
            data: { 
                email: dto.email,
                hash: hashedPassword,
                username: dto.username
            }
        })
        .catch((error) => {
            if (error instanceof PrismaClientKnownRequestError) {
                // Throw error if unique contrait fails -> user exists already
                if (error.code === "P2002") {
                    throw new BadRequestException ("User Already Exists")
                }
            }
            throw error
        })

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtToken(newUser.id, tokens.refresh_token);
        return tokens;
    }

    async signinLocal(dto: AuthDto): Promise<Tokens> {
        // find the user
        const currentUser = await this.prisma.user
        .findUnique({
            where: {
                email: dto.email,
            }
        })
        .catch((error) => {
            if (error instanceof PrismaClientKnownRequestError) {
                // Throw error if user not found
                if (error.code === "P2001") {
                    throw new ForbiddenException ("User Does Not Exist")
                }
            }
            throw error
        })
        // Reject if user not found
        // if (!currentUser) throw new ForbiddenException ("Incorrect Credentials")

        // decrpyt and check the password
        const passwordMatch = await argon2.verify(currentUser.hash, dto.password)
        if (!passwordMatch) throw new ForbiddenException ("Entered Credentials Do Not Match")

        // return the user and tokens
        const tokens = await this.getTokens(currentUser.id, currentUser.email);
        await this.updateRtToken(currentUser.id, tokens.refresh_token);
        return tokens
    }

    signout() {}

    refreshTokens() {}
}