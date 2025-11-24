import { Redirect, useRootNavigationState } from "expo-router";

import { UserRole } from "@/config/enums";
import { useAuth } from "@/contexts/AuthContext";

export default function() {
	const { session } = useAuth();

	const rootNavigationState = useRootNavigationState();

	if (!rootNavigationState.key) return null;

	return session.role === UserRole.COMMERCE
		? <Redirect href="/commerce" />
		: <Redirect href="/clients" />
}