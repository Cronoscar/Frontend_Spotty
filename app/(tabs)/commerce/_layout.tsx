import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { UserRole } from "@/config/enums";

import { Tab } from "@/types/tab";

import { useAuth } from "@/contexts/AuthContext";

export default function() {
	const { session } = useAuth();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#275C9C",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
			}}
		>
			{
				getTabs()
					.map(function(tab: Tab) {
						return { ...tab, show: tab.roles.includes(session.role)}
					})
					.map(function(tab: Tab) {
						return (
							<Tabs.Screen
								name={ tab.name }
								options={{
									title: tab.title,
									tabBarIcon: function({ color, size }) {
										return <Ionicons name={ tab.icon } color={color} size={size} />
									},
									...( tab.show ? {} : { href: null } )
								}}
							/>
						);
					})
			}
		</Tabs>
	);
};

function getTabs(): Tab[] {
	return [
		{
			name: "index",
			title: "Inicio",
			icon: "home-outline",
			roles: [UserRole.COMMERCE],
			show: false,
		},
		{
			name: "reports",
			title: "Estadísticas",
			icon: "stats-chart-outline",
			roles: [UserRole.COMMERCE],
			show: false,
		},
		{
			name: "bookings",
			title: "Reservas",
			icon: "calendar-outline",
			roles: [UserRole.COMMERCE],
			show: false,
		},
		{
			name: "profile",
			title: "Perfil",
			icon: "person-outline",
			roles: [UserRole.COMMERCE],
			show: false,
		},
	];
}