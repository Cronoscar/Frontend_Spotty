import { PaymentMethod } from '@/config/enums';

export type AuthContextType = {
	session: Session | null;
	login: ( email: string, password: string ) => Promise<ApiResponse<null>>;
	logout: () => Promise<ApiResponse<null>>;
	loadingSession: boolean;
};

export type SpotBookingData = {
	id?: any,
	title?: string;
	location?: string;
	position?: string;
	date?: string;
	startTime?: string;
	endTime?: string;
	time?: number,
	total?: number;
	isv?: number;
	subtotal?: number;
	paymentMethod?: PaymentMethod;
	cardNumber?: string;
	expirationDate?: string;
	CVV?: string;
	cardOwner?: string;
};

export type SpotBookingContextType = {
	data: SpotBookingData | null;
	setData: (data: SpotBookingData | null) => void;
};