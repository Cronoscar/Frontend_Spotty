import { UserRole } from "@/config/enums";
import { useAuth } from "@/contexts/AuthContext";

import { Tab } from "@/types/tab";

export function useTabs(): Tab[] {
	const { session } = useAuth();

	return [
		{
			name: "index",
			title: "",
			icon: "",
			roles: [],
		},
		{
			name: "client",
			title: "Inicio",
			icon: "home-outline",
			roles: [UserRole.NON_AUTHENTICATED_USER, UserRole.AUTHENTICATED_USER]
		},
		{
			name: "commerce",
			title: "Inicio",
			icon: "home-outline",
			roles: [UserRole.COMMERCE]
		},
	].map(function(tab) {
		return { ...tab, show: tab.roles.includes(session.role) } as Tab;
	}) as Tab[];
}