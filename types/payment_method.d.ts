export type PaymentMethod = {
    id: number;
    title: string;
    expirationDate: string;
    isDefault?: boolean;
};