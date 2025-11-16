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
	total?: number;
	isv?: number;
};

export type SpotBookingContextType = {
	data: SpotBookingData | null;
	setData: (data: SpotBookingData | null) => void;
};