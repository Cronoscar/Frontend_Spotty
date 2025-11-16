import { Stack } from "expo-router";
import { AuthProvider } from '@/contexts/AuthContext';

export default () => (
  <AuthProvider>
		<Stack screenOptions={{ headerShown: false, }}>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen name="auth" />
			<Stack.Screen name="spotDetails" />
			<Stack.Screen name="spotBooking" />
		</Stack>
	</AuthProvider>
);
