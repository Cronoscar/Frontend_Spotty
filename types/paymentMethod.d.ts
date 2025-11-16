import { PaymentMethod as PaymentMethodEnum } from "@/config/enums";

export type PaymentMethod = {
		id: number;
		title: string;
		expirationDate: string;
		isDefault?: boolean;
};

export type PaymentMethodOptionType = {
	type: PaymentMethodEnum;
	label: string;
	icon: keyof typeof Ionicons.glyphMap;
	selectedType?: PaymentMethodEnum | null;
	setType?: (type: PaymentMethodEnum) => void;
};