import { Review } from "./review";

export type SpotDetails = {
    id: number;
	title: string;
	location: string;
	freeSpots: number;
	totalSpots: number;
	distance: number;
	stars: number;
	price: number;
	image?: string;
	nReviews: number;
	reviews: Review[];
};

export type Spot = {
	id: number;
	title: string;
	location: string;
	freeSpots: number;
	distance: number;
	stars: number;
	price: number;
	image?: string,
};