import { useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from "expo-router";
import { UserRole } from "@/config/enums";

export function useAuthStatus( action?: () => void ) {
	const router = useRouter();
	const { session, loadingSession } = useAuth();

	useEffect(function() {
		if (!loadingSession && session.role === UserRole.NON_AUTHENTICATED_USER) {
			router.replace("/auth");
			return;
		}

		if (!loadingSession && session.role != UserRole.NON_AUTHENTICATED_USER) {
			action && action();
		}
	}, [loadingSession, session]);
};
