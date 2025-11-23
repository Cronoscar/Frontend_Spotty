import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/contexts/AuthContext";

export default function() {
	const  { session } = useAuth();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#275C9C",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Inicio",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Buscar",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="search-outline" color={color} size={size} />
					)
				}}
			/>
			<Tabs.Screen
				name="bookings"
				options={{
					title: "Reservas",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar-outline" color={color} size={size} />
					)
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Perfil",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);
};