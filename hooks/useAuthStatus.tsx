import { useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from "expo-router";

export function useAuthStatus( action?: () => void ) {
	const router = useRouter();
	const { session, loadingSession } = useAuth();

	useEffect(function() {
		if (!loadingSession && !session) {
			router.replace("/auth");
			return;
		}

		if (!loadingSession && session) {
			action && action();
		}
	}, [loadingSession, session]);
};
