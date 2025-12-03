import { Form } from "@/config/enums";
import { PaymentMethod } from "./paymentMethod";
import { Review } from "./review";
import { Spot } from "./spot";
import { Place } from "./place";
import { BookingCommerce } from "./booking";

export type BookingListProps = {
		bookings: Booking[];
};

export type LoginFormProps = {
		setError: (error: string) => void;
		setForm: (form: Form) => void;
};

export type PaymentMethodListProps = {
		paymentMethods: PaymentMethod[];
};

export type RegisterFormProps = {
		setError: (error: string) => void;
		setForm: (form: Form) => void;
		userType: number;
};

export type ReviewItemProps = {
		id: int;
		userName: string;
		title: string;
		content: string;
		image: any;
};

export type ReviewListProps = {
		reviews: Review[];
};

export type SpotItemProps = {
		id: int;
		title: string;
		location: string;
		freeSpots: int;
		distance: number;
		stars: number;
		price: number;
		image: any;
};

export type SpotListProps = {
		spots: Spot[];
};

export type SpotGridProps = {
		rows: string[];
		selectedSpot?: SpotBookingData;
		setSelectedSpot?: (pos: SpotBookingData) => void;
		continueAction?: () => void;
};

export type RowProps = {
		columns: string[];
		rowIdx: number;
		selected: { x: number; y: number } | null;
		setSelected: (pos: { x: number; y: number } | null) => void;
		allowPress: boolean;
};

export type SpotSquareProps = {
		bit: 1 | 0;
		x: number;
		y: number;
		selected: { x: number; y: number } | null;
		setSelected: (pos: { x: number; y: number } | null) => void;
		allowPress: boolean;
};

export type FAQItemProps = {
		title: string;
		answer: string;
};

export type PaymentMethodItemProps = {
		title: string;
		expirationDate: string;
		isDefault?: boolean;
};

export type FAQListProps = {
		faqs: FAQ[];
};

export type SelectProps = {
	selectId: number;
	name: string;
	options: string[];
	filters: Record<number, string>,
	setFilters: (filters: Record<number, string>) => void;
}

export type SearchFiltersProps = {
	filters: Record<number, string>;
	setFilters: (filters: Record<number, string>) => void;
};

export type PlaceListProps = {
    places: Place[];
    onRefresh?: () => void; 
};


export type PlaceItemProps = {
    id: number;
    title: string;
    location: string;
    price: string;
    availableSpots: number;
    totalSpots: number;
    schedule?: string; // Agregar schedule opcional
    commerceId?: number; // Agregar commerceId opcional
};

export type RowConfigurationProps = {
	rowIndex: number;
	rows: string[];
	setRows: (rows: string[]) => void;
};

export type PlaceStatItemProps = {
	id: number;
	title: string;
	location: string;
	price: string;
	availableSpots: number;
	totalSpots: number;
	schedule: string;
};

export type PlaceStatListProps = PlaceListProps;

export type BookingCommerceListProps = {
	bookings: BookingCommerce[];
};