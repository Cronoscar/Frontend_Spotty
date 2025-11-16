import { Form } from "@/config/enums";
import { PaymentMethod } from "./paymentMethod";
import { Review } from "./review";
import { Spot } from "./spot";

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
		spots: string;
		nColumns: number;
		selectedSpot: SpotBookingData;
		setSelectedSpot: (pos: SpotBookingData) => void;
		continueAction?: () => void;
};

export type RowProps = {
		columns: string[];
		rowIdx: number;
		selected: { x: number; y: number } | null;
		setSelected: (pos: { x: number; y: number } | null) => void;
};

export type SpotSquareProps = {
		bit: 1 | 0;
		x: number;
		y: number;
		selected: { x: number; y: number } | null;
		setSelected: (pos: { x: number; y: number } | null) => void;
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