export type Booking = {
	id: number;
	title: string;
	state: string;
	location: string;
	date: string;
	time: string;
	price: number;
};

export type BookingItemProps = {
	title: string;
	state: string;
	location: string;
	date: string;
	time: string;
	price: number;
};

export type BookingCommerce = {
	id: number;
	title: string;
	location: string;
	nBookings: number;
	availableSpots: number;
	totalSpots: number;
	bookings?: any[],
	img?: string;
};

export type BookingCommerceItemProps = {
	id: number;
	title: string;
	location: string;
	nBookings: number;
	totalSpots: number;
	availableSpots: number;
	img?: string;
	bookings: string[];
};