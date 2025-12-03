// hooks/useAuthStatus.tsx - VERSIÓN SIMPLIFICADA
import { useEffect, useRef } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSegments } from "expo-router";
import { UserRole } from "@/config/enums";

export function useAuthStatus() {
    const router = useRouter();
    const segments = useSegments();
    const { session, loadingSession } = useAuth();
    
    const isMounted = useRef(true);
    const hasNavigated = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        // No hacer nada si aún está cargando
        if (loadingSession) return;
        
        // No hacer nada si ya navegamos
        if (hasNavigated.current) return;
        
        if (session.role === UserRole.NON_AUTHENTICATED_USER) {
            const inAuthGroup = segments[0] === 'auth';
            
            if (!inAuthGroup && isMounted.current) {
                // Pequeño retraso para evitar problemas de timing
                const timer = setTimeout(() => {
                    if (isMounted.current && !hasNavigated.current) {
                        hasNavigated.current = true;
                        try {
                            router.replace("/auth");
                        } catch (error) {
                            // Silenciar error si el router no está disponible
                        }
                    }
                }, 150);
                
                return () => clearTimeout(timer);
            }
        }
    }, [session, loadingSession, segments, router]);
}