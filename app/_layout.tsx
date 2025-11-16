import { Slot, Stack } from "expo-router";
import { AuthProvider } from '@/contexts/AuthContext';

export default () => (
  <AuthProvider>
		<Slot />
	</AuthProvider>
);
