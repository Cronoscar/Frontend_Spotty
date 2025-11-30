import { createContext, useContext, useState, useEffect, useMemo } from "react";
import AuthService from "@/services/AuthService";

import { ApiResponse } from "@/types/api";
import { Session } from "@/types/session";
import { AuthContextType } from "@/types/context";

import { UserRole } from "@/config/enums";

const defaultSession: Session = {
	id: null,
	token: null,
	role: UserRole.NON_AUTHENTICATED_USER,
}

const AuthContext = createContext<AuthContextType>({
	session: defaultSession,
	login: async () => Promise<{ ok: false }>,
	logout: async () => Promise<{ ok: false }>,
	loadingSession: true,
} as AuthContextType);

export function AuthProvider({ children }: any ) {
	const [session, setSession] = useState<Session>(defaultSession);
	const [loadingSession, setLoadingSession] = useState(false);

	useEffect(function () {
		checkSession();
	}, []);

	async function checkSession() {
		setLoadingSession(true);

		const response: ApiResponse<Session> = await AuthService.getSession();

		setLoadingSession(false);

		if (response.error) return;

		response.data && setSession(response.data);
	}

	async function login( email: string, password: string ): Promise<ApiResponse<any>> {
		const res: ApiResponse<Session> = await AuthService.login(email, password);

		if (res?.ok && res.data) {
			setSession(res.data);
			return { ok: true, data: res.data };
		}

		return { ok: false };
	}

	async function logout(): Promise<ApiResponse<null>> {
		const res = await AuthService.logout();

		if (res?.ok) {
			setSession(defaultSession);
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
