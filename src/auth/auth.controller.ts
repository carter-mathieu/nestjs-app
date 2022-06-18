import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/local/signup")
    @HttpCode(HttpStatus.CREATED) // return 201 if truthy
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);
    }

    @Post("/local/signin")
    @HttpCode(HttpStatus.OK) // return 200 if truthy
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signinLocal(dto);
    }

    @UseGuards(AuthGuard("jwt-access")) // use jwt-access strategy as the auth guard
    @Post("/signout")
    @HttpCode(HttpStatus.OK) // return 200 if truthy
    signout(@Req() req: Request) {
        const user = req.user; // retrieve user from request object in the strategy
        return this.authService.signout(user["sub"]);
    }

    @UseGuards(AuthGuard("jwt-refresh")) // use jwt-refresh strategy as the auth guard
    @Post("/refresh")
    @HttpCode(HttpStatus.OK) // return 200 if truthy
    refreshTokens(@Req() req: Request): Promise<Tokens> {
        const user = req.user;
        return this.authService.refreshTokens(user["sub"], user["refreshToken"]);
    }
}
