import { Stack } from "expo-router";

export default () => (
  <Stack screenOptions={{ headerShown: false }}>
		<Stack.Screen name="index" />
		<Stack.Screen name="edit" />
		<Stack.Screen name="payment_methods" />
	</Stack>
);
