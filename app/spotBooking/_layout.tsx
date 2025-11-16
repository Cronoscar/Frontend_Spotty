import { Slot } from "expo-router";
import { SpotBookingProvider } from '@/contexts/SpotBookingContext';

export default () => (
	<SpotBookingProvider>
		<Slot />
	</SpotBookingProvider>
);
