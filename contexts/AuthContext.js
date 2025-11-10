import { createContext, useContext, useState, useEffect, useMemo } from "react";
import AuthService from "@/services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [loadingSession, setLoadingSession] = useState(false);

	useEffect(() => {
		checkSession();
	}, []);

	const checkSession = async () => {
		setLoadingSession(true);
		setSession( await AuthService.getSession() );
		setLoadingSession(false);
	};

	const login = async (email, password) => {
		const res = await AuthService.login(email, password);

		if (res?.ok) {
			setSession(res.data);
			return { ok: true };
		}
	};

	const logout = async () => {
		const res = await AuthService.logout();

		if (res?.ok) {
			setSession(null);
			return { ok: true };
		}
	};

	const contextValue = useMemo(
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

export const useAuth = () => useContext(AuthContext);
