import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    async register(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        const user = await this.usersService.create(username, email, password);
        return { success: true, message: 'User registered successfully', userId: user._id.toString() };
    }

    @Post('login')
    async login(@Body('username') username: string, @Body('password') password: string) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const username = req.user.username; // Extract username from the JWT payload
        const user = await this.usersService.findOne(username); // Fetch full user details
        if (!user) {
            throw new Error('User not found'); // Handle case where user is not found
        }
        return { sucess: true, message: "User data", data: user };
    }

    @UseGuards(JwtAuthGuard)
    @Get('wallet')
    async getWallet(@Request() req){
        const userId = req.user._id;
        const userWallet = await this.usersService.findWallet(userId);
        if (!userWallet) {
            throw new Error('User not found'); // Handle case where user is not found
        }
        return { sucess: true, message: "User Wallet", data: userWallet };
    }

    @UseGuards(JwtAuthGuard) // Ensure the user is authenticated
    @Post('add-balance/:userId')
    async addBalance(
        @Param('userId') userId: string,
        @Body('amount') amount: number
    ) {
        const userObjectId = new Types.ObjectId(userId); // Convert string to ObjectId
        if (amount <= 0) {
            throw new Error('Amount must be greater than zero'); // Basic validation
        }
        const updatedUser = await this.usersService.addBalance(userObjectId, amount);
        if (!updatedUser) {
            throw new Error('User not found'); // Handle case where user is not found
        }
        return {
            success: true,
            message: 'Balance updated successfully',
            balance: updatedUser.balance
        };
    }
}