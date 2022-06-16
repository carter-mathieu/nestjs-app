import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";

// Create an access token strategy for implementing Passport authentication on access tokens
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        // configure the strategy methods from the PasspratStrategy to be used on AtStrategy
        super({
            // Define where in request to get the access token from
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // Todo: replace rt-secrect with env variable
            secretOrKey: "rt-secret",
            // Make sure we pass back the refresh token in the request
            passReqToCallback: true
        })
    }
    // Extract the payload and by default it is attached to the user object
    validate(req: Request, payload: any){
        const refreshToken = req.get("authorization").replace("Bearer", "").trim()
        return {
            ...payload,
            refreshToken,
        }
    }
}