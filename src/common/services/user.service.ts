import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/account.schema';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/api/auth/dto/signup.dto';
import { AccountDocument } from 'src/interface/Account';

@Injectable()
export class UserService {
    logger: Logger = new Logger(UserService.name);;
    constructor(
        @InjectModel(Account.name) private accountModel: Model<Account>,
    ) { }

    findOne(query: any): Promise<AccountDocument> {
        return this.accountModel.findOne(query).select('+password');
    }

    async create(signupDto: SignUpDto): Promise<AccountDocument> {
        this.logger.log('Creating user.');

        const hashedPassword = await bcrypt.hash(signupDto.password, 12);

        const newUser = new this.accountModel(signupDto);
        newUser.password = hashedPassword;
        return newUser.save();
    }

    async validateAccount(username: string, password: string): Promise<AccountDocument | null> {
        const account = await this.accountModel.findOne({ username });
        if (!account) {
            return Promise.resolve(null);
        }

        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) {
            return Promise.resolve(null);
        }

        return account;
    }

    findOneAndUpdate(query: any, payload: any): Promise<AccountDocument> {
        this.logger.log('Updating User.');
        return this.accountModel.findOneAndUpdate(query, payload, {
            new: true,
            upsert: true,
        });
    }

    findOneAndRemove(query: any): Promise<any> {
        this.logger.log('Deleting User.');
        return this.accountModel.findOneAndDelete(query);
    }
}