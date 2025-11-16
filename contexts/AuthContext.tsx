import { createContext, useContext, useState, useEffect, useMemo } from "react";
import AuthService from "@/services/AuthService";

import { ApiResponse } from "@/types/api";
import { Session } from "@/types/session";
import { AuthContextType } from "@/types/context";

const AuthContext = createContext<AuthContextType>({
	session: null,
	login: async () => Promise<{ ok: false }>,
	logout: async () => Promise<{ ok: false }>,
	loadingSession: true,
} as AuthContextType);

export const AuthProvider = ({ children }: any ) => {
	const [session, setSession] = useState<Session | null>(null);
	const [loadingSession, setLoadingSession] = useState(false);

	useEffect(() => {
		checkSession();
	}, []);

	async function checkSession() {
		setLoadingSession(true);

		const response: ApiResponse<Session> = await AuthService.getSession();

		if (response.error) {
			return;
		}

		if (response.data) setSession( response.data );
		setLoadingSession(false);
	}

	async function login( email: string, password: string ): Promise<ApiResponse<null>> {
		const res: ApiResponse<Session> = await AuthService.login(email, password);

		if (res?.ok && res.data) {
			setSession(res.data);
			return { ok: true };
		}

		return { ok: false };
	}

	async function logout(): Promise<ApiResponse<null>> {
		const res = await AuthService.logout();

		if (res?.ok) {
			setSession(null);
			return { ok: true };
		}

		return { ok: false };
	}

	const contextValue: AuthContextType = useMemo(
		() => ({
			session,
			login,
			logout,
			loadingSession,
		}), [session]
	);

	return (
		<AuthContext.Provider value={ contextValue }>
			{ children }
		</AuthContext.Provider>
	);
};

export function useAuth () { return useContext(AuthContext); }
