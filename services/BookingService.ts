import { BookingFilter } from "@/config/enums";
import { ApiResponse } from "@/types/api";
import { Booking } from "@/types/booking";

const examplePastBookings: Booking[] = [
	{
		id: 1,
		title: "Reserva pasada 1",
		state: "Confirmado",
		location: "Av. Los Próceres #45, Tegucigalpa",
		date: "2025-11-09",
		time: "07:30 AM - 10:30 AM",
		price: 50,
	},
	{
		id: 2,
		title: "Reserva pasada 2",
		state: "Confirmado",
		location: "Av. Los Próceres #45, Tegucigalpa",
		date: "2025-11-09",
		time: "07:30 AM - 10:30 AM",
		price: 50,
	}
];

const exampleBookings = [
  {
    id: 1,
    title: "Parqueo Central",
    state: "Confirmado",
    location: "Av. Los Próceres #45, Tegucigalpa",
    date: "2025-11-09",
    time: "07:30 AM - 10:30 AM",
    price: 50,
  },
  {
    id: 2,
    title: "Parking Mall Multiplaza",
    state: "Confirmado",
    location: "Boulevard Suyapa, Tegucigalpa",
    date: "2025-11-10",
    time: "09:00 AM - 09:00 AM",
    price: 80,
  },
  {
    id: 3,
    title: "Parqueo Zona Viva",
    state: "Confirmado",
    location: "Col. Palmira, Calle 8",
    date: "2025-11-05",
    time: "06:15 PM - 09:00 AM",
    price: 60,
  },
  {
    id: 4,
    title: "Parking Aeropuerto Toncontín",
    state: "Confirmado",
    location: "Carretera al Sur",
    date: "2025-11-01",
    time: "11:45 AM - 09:00 AM",
    price: 100,
  },
  {
    id: 5,
    title: "Parqueo Estadio Nacional",
    state: "Confirmado",
    location: "Boulevard Morazán",
    date: "2025-11-12",
    time: "04:00 PM - 09:00 AM",
    price: 75,
  },
];

class BookingService {
	static async getUserBookings( id: number, filter: BookingFilter ): Promise<ApiResponse<Booking[]>> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					error: false,
					ok: true,
					data: filter == BookingFilter.ON_GOING ? exampleBookings : examplePastBookings,
				});
			}, 3000);
		});
	}

	static async getBooking( id: number ): Promise<ApiResponse<Booking>> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					error: false,
					ok: true,
					data: exampleBookings[0],
				});
			}, 3000);
		});
	}
}

export default BookingService;
