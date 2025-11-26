import { Slot } from "expo-router";
import { SpotBookingProvider } from '@/contexts/SpotBookingContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default () => (
	<SpotBookingProvider>
		<Slot />
	</SpotBookingProvider>
);
