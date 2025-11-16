import { SpotBookingContextType, SpotBookingData } from "@/types/context";
import { createContext, useContext, useState } from "react";

const SpotBookingContext = createContext<SpotBookingContextType>({
	data: null,
	setData: () => {},
} as SpotBookingContextType);

export function SpotBookingProvider({ children }: any) {
	const [data, setData] = useState<SpotBookingData | null>(null);

	return (
		<SpotBookingContext.Provider value={{ data, setData }}>
			{ children }
		</SpotBookingContext.Provider>
	);
}

export function useSpotBooking() { return useContext(SpotBookingContext) };