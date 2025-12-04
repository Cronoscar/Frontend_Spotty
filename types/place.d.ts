
export type Place = {
	id: number;
	title: string;
	location: string;
	price: string;
	availableSpots: number;
	totalSpots: number;
	schedule: string;
	commerceId?: number; 
	img: string;
	occupancyRate?: number;
	totalReservations?: number;
    totalRevenue?: number;
    activeReservations?: number;
    completedReservations?: number;
    upcomingReservations?: number;
};