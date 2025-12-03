// contexts/AuthContext.tsx - VERSIÓN CORREGIDA
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
    login: async () => ({ ok: false } as ApiResponse<any>),
    logout: async () => ({ ok: false } as ApiResponse<null>),
    loadingSession: true,
} as AuthContextType);

export function AuthProvider({ children }: any) {
    const [session, setSession] = useState<Session>(defaultSession);
    const [loadingSession, setLoadingSession] = useState(false);

    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        setLoadingSession(true);
        try {
            const response: ApiResponse<Session> = await AuthService.getSession();
            if (response.ok && response.data) {
                setSession(response.data);
            }
        } catch (error) {
            console.error("Error checking session:", error);
        } finally {
            setLoadingSession(false);
        }
    }

    async function login(email: string, password: string): Promise<ApiResponse<any>> {
        try {
            const res: ApiResponse<Session> = await AuthService.login(email, password);

            if (res?.ok && res.data) {
                setSession(res.data);
                return { 
                    ok: true, 
                    data: res.data
                };
            }

            return { 
                ok: false, 
                error: true
            };
        } catch (error: any) {
            console.error("Login error in context:", error);
            return { 
                ok: false, 
                error: true
            };
        }
    }

    async function logout(): Promise<ApiResponse<null>> {
        try {
            const res = await AuthService.logout();
            if (res?.ok) {
                setSession(defaultSession);
                return { ok: true };
            }
            return { ok: false, error: true };
        } catch (error) {
            console.error("Logout error:", error);
            return { ok: false, error: true };
        }
    }

    const contextValue: AuthContextType = useMemo(
        () => ({
            session,
            login,
            logout,
            loadingSession,
        }), [session, loadingSession]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() { 
    return useContext(AuthContext); 
}