import { PaymentMethod } from "./enums";
import { PaymentMethodOptionType } from "@/types/paymentMethod";

const Configuration = {
	API_BASE_URL: "" as string,
	paymentMethods: [
		{
			type: PaymentMethod.CREDIT_CARD,
			label: "Tarjeta de Crédito",
			icon: "card-outline",
		},
		{
			type: PaymentMethod.CASH,
			label: "Efectivo",
			icon: "cash-outline",
		},
		{
			type: PaymentMethod.DIGITAL_WALLET,
			label: "Billetera Digital",
			icon: "wallet-outline",
		},
	] as PaymentMethodOptionType[],
};

export default Configuration;
