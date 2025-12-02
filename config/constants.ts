import { PaymentMethod } from "./enums";
import { PaymentMethodOptionType } from "@/types/paymentMethod";

const Configuration = {
	SPOTTY_PRIMARY_COLOR: "#275C9C",
	SPOTTY_SECONDARY_COLOR: "#88CFE7",
	//API_BASE_URL: "https://spottyapp-aedmgmczcke8d5c4.canadacentral-01.azurewebsites.net",
	API_BASE_URL:"http://localhost:8000/",
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
