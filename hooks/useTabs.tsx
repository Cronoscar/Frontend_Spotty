import { UserRole } from "@/config/enums";
import { useAuth } from "@/contexts/AuthContext";

import { Tab } from "@/types/tab";
import { useEffect, useState } from "react";

const rootTabs: Tab[] = [
	{
		name: "index",
		title: "",
		icon: "",
		roles: [],
		show: false
	},
	{
		name: "client",
		title: "Inicio",
		icon: "home-outline",
		roles: [UserRole.NON_AUTHENTICATED_USER, UserRole.AUTHENTICATED_USER],
		show: false
	},
	{
		name: "commerce",
		title: "Inicio",
		icon: "home-outline",
		roles: [UserRole.COMMERCE],
		show: false
	},
]

export function useTabs(): Tab[] {
	const { session } = useAuth();

	const [tabs, setTabs] = useState<Tab[]>([]);

	useEffect(function() {
		setTabs(rootTabs.map(function(tab) {
			return { ...tab, show : tab.roles.includes(session.role) } as Tab;
		}));
	}, [session]);

	return tabs;
}