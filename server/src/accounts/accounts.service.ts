import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import {
    Transaction,
    TransactionDocument,
} from 'src/transactions/schemas/transaction.schema';
import SendMoneyDto from './dto/send-money.dto';

@Injectable()
export class AccountsService {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        @InjectModel(Transaction.name)
        private transactionModel: Model<TransactionDocument>,
    ) {}

    async create(createAccountDto: any) {
        try {
            const account = new this.accountModel(createAccountDto);
            return await account.save();
        } catch (error) {
            throw new Error('Account faild');
        }
    }

    async sendMoney(sendMoneyDto: SendMoneyDto) {
        const { senderId, receiverId, amount, note, action } = sendMoneyDto;

        const sender = await this.accountModel.findById(senderId);
        const receiver = await this.accountModel.findById(receiverId);

        if (sender && receiver) {
            if (sender.balance + sender.minimumBalance < amount) {
                throw new Error('You have not sufficient balance');
            }

            // Update account balance
            sender.balance -= amount;
            receiver.balance += amount;

            // Create new transaction
            const transaction = new this.transactionModel();
            transaction.sender = sender._id.toString();
            transaction.senderName = sender.name;
            transaction.receiver = receiver._id.toString();
            transaction.receiverName = receiver.name;
            transaction.amount = amount;
            transaction.senderNewBalance = sender.balance;
            transaction.receiverNewBalance = receiver.balance;
            transaction.senderLastTransaction = sender.lastTransaction;
            transaction.receiverLastTransaction = receiver.lastTransaction;
            transaction.senderName = sender.name;
            transaction.action = action;
            transaction.note = note;

            // Save the transaction
            if (await transaction.save()) {
                // Update sender account details
                sender.lastTransaction = transaction._id.toString();
                sender.lastTransactionAmount = -amount;
                sender.lastTransactionAccountName = receiver.name;
                sender.lastTransactionDate = transaction.date;
                sender.lastTransactionNote = note;
                sender.lastTransactionAction = action;

                // Update receiver account details
                receiver.lastTransaction = transaction._id.toString();
                receiver.lastTransactionAmount = amount;
                receiver.lastTransactionAccountName = sender.name;
                receiver.lastTransactionDate = transaction.date;
                receiver.lastTransactionNote = note;
                receiver.lastTransactionAction = action;

                // Save accounts
                await sender.save();
                await receiver.save();

                return transaction;
            } else {
                return null;
            }
        } else {
            console.log('Account not found');
        }
    }

    findAll() {
        return `This action returns all accounts`;
    }

    async findOne(id: string) {
        return await this.accountModel.findById(id);
    }

    update(id: number, updateAccountDto: UpdateAccountDto) {
        return `This action updates a #${id} account`;
    }

    remove(id: number) {
        return `This action removes a #${id} account`;
    }
}
