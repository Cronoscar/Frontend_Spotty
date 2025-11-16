import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

interface Tab {
	name: string,
	title: string,
	iconName: IconName,
}

const tabs: Tab[] = [
	{ name:"index", title: "Inicio", iconName: "home-outline" },
	{ name:"search", title: "Buscar", iconName: "search-outline" },
	{ name:"bookings", title: "Reservas", iconName: "calendar-outline" },
	{ name:"profile", title: "Perfil", iconName: "person-outline" },
];

export default () => (
	<Tabs
		screenOptions={{
			tabBarActiveTintColor: "#275C9C",
			tabBarInactiveTintColor: "gray",
			headerShown: false,
		}}>
			{ tabs.map(tab => (
				<Tabs.Screen
					name={ tab.name }
					options={{
						title: tab.title,
						tabBarIcon: ({ color, size }) => (
							<Ionicons name={ tab.iconName } color={ color } size={ size } />
						),
					}}
				/>
			)) }
	</Tabs>
);
