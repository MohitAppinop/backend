import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        if (user._doc) {
            const payload = { username: user._doc.username, userId: user._doc._id };
            return {
                success: true,
                message: "Login Successful",
                access_token: this.jwtService.sign(payload),
            };
        } else {
            throw new Error('User object is not valid');
        }
    }
}