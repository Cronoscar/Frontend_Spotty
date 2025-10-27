import { Stack } from "expo-router";
import { View } from "react-native";

const RootLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "#275C9C",
					flex: 1,
				},
				headerTitleAlign: "center",
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontSize: 20,
					fontWeight: "bold",
				},
				contentStyle: {
					paddingHorizontal: 10,
					paddingTop: 10,
					backgroundColor: "#fff",
				}
			}}
		>
			<Stack.Screen name="(tabs)" options={{ title: "Bienvenido" }} />
		</Stack>
	);
};

export default RootLayout;
