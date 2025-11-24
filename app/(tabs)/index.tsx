import { Redirect, useRootNavigationState } from "expo-router";
import { useEffect } from "react";

import { UserRole } from "@/config/enums";
import { useAuth } from "@/contexts/AuthContext";

export default function() {
	const { session } = useAuth();

	useEffect(() => {
		console.log(session);
	}, []);

	const rootNavigationState = useRootNavigationState();

	if (!rootNavigationState.key) return null;

	return session.role === UserRole.COMMERCE
		? <Redirect href="/commerce/places" />
		: <Redirect href="/clients" />
}