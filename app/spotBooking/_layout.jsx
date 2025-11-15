import { Stack } from "expo-router";

export default () => (
  <Stack screenOptions={{ headerShown: false }}>
		<Stack.Screen name="index" />
		<Stack.Screen name="bookDate" />
	</Stack>
);
