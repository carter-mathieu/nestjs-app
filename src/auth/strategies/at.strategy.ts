import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// Create an access token strategy for implementing Passport authentication on access tokens
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor() {
        // configure the strategy methods from the PasspratStrategy to be used on AtStrategy
        super({
            // Define where in request to get the access token from
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // Todo: replace at-secrect with env variable
            secretOrKey: "at-secret"
        })
    }
    // Extract the payload and by default it is attached to the user object
    validate(payload: any){
        return payload;
    }
}