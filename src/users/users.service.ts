import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(username: string, email: string, password: string): Promise<UserDocument> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const createdUser = new this.userModel({ username, email, password: hashedPassword });
            return await createdUser.save();
        } catch (error) {
            if (error.code === 11000) { // MongoDB duplicate key error code
                throw new Error('User with this username or email already exists');
            }
            throw error;
        }
    }

    async findOne(username: string): Promise<UserDocument | undefined> {
        return this.userModel.findOne({ username }).exec();
    }

    async findWallet(userId: ObjectId): Promise<{ balance?: number }> {
        const result = await this.userModel.aggregate([
            { $match: { _id: userId } },
            { $project: { balance: 1, _id: 0 } }
        ]).exec();

        return result.length > 0 ? result[0] : { balance: 0 };
    }

    async addBalance(userId: Types.ObjectId, amount: number): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $inc: { balance: amount } }, 
            { new: true }
        ).exec();
    }
}