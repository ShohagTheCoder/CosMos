export default interface SendMoneyDto {
    senderId: string;
    receiverId: string;
    amount: number;
    action: string;
    note: string;
}
