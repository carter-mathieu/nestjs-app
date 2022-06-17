import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    username: string;
}
