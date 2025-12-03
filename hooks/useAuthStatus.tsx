// hooks/useAuthStatus.tsx - VERSIÓN CORREGIDA
import { useEffect, useRef, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSegments } from "expo-router";
import { UserRole } from "@/config/enums";

export function useAuthStatus(action?: () => void) {
  const router = useRouter();
  const segments = useSegments();
  const { session, loadingSession } = useAuth();
  
  // Usar refs para controlar el estado de montaje
  const isMounted = useRef(false);
  const hasNavigated = useRef(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Marcar como montado después de un breve retraso
    const timer = setTimeout(() => {
      isMounted.current = true;
      setIsAppReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 1. No hacer nada si aún está cargando
    if (loadingSession) return;
    
    // 2. No hacer nada si la app no está lista
    if (!isAppReady) return;
    
    // 3. Evitar múltiples navegaciones
    if (hasNavigated.current) return;
    
    // 4. Usar setTimeout para asegurar que React ha terminado el renderizado
    const timer = setTimeout(() => {
      if (session.role === UserRole.NON_AUTHENTICATED_USER) {
        // Verificar si ya estamos en una ruta de auth
        const inAuthGroup = segments[0] === 'auth';
        
        if (!inAuthGroup) {
          hasNavigated.current = true;
          router.replace("/auth");
        }
      } else if (session.role !== UserRole.NON_AUTHENTICATED_USER) {
        action && action();
      }
    }, 100); // Pequeño retraso para asegurar montaje
    
    return () => clearTimeout(timer);
  }, [loadingSession, session, isAppReady, segments, action, router]);

  return { session, loadingSession, isAppReady };
}