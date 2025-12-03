// services/AuthService.ts - VERSIÓN CORREGIDA CON TIPOS
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ApiResponse } from "@/types/api";
import { Session } from "@/types/session";
import { UserRole } from "@/config/enums";
import Configuration from "@/config/constants";

class AuthService {
    static async getSession(): Promise<ApiResponse<Session>> {
        try {
            const session = await AsyncStorage.getItem("session");
            if (!session) {
                return { error: true };
            }
            return { ok: true, data: JSON.parse(session) };
        } catch (e) {
            return { error: true };
        }
    }

    static async login(email: string, password: string): Promise<ApiResponse<Session>> {
        try {
            // Usar el endpoint de CEO/login
            const endpoint = '/api/CEO/login';
            
            const response = await axios.post(
                `${Configuration.API_BASE_URL}${endpoint}`,
                {
                    email: email.trim(),
                    password: password.trim()
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000
                }
            );

            console.log("Login response:", response.data);

            if (response.data.success && response.data.data) {
                const data = response.data.data;
                
                // Determinar el rol: si viene commerce, es comercio (3), sino usuario normal (2)
                const role = data.commerce ? UserRole.COMMERCE : UserRole.AUTHENTICATED_USER;
                
                // Construir la sesión con userData
                const sessionData: Session = {
                    id: data.person.ID,
                    token: data.person.Token || "", // Si no hay token, dejamos string vacío
                    role: role,
                    userData: {
                        person: data.person,
                        commerce: data.commerce || null
                    }
                };

                // Guardar en AsyncStorage
                await AsyncStorage.setItem("session", JSON.stringify(sessionData));
                
                return { ok: true, data: sessionData };
            } else {
                // Si el backend devuelve success: false pero no es un error HTTP
                return { 
                    ok: false, 
                    error: true
                };
            }
        } catch (error: any) {
            console.error("Login error:", error.response?.data || error.message);
            
            // Devolver error sin message (porque ApiResponse no lo tiene)
            return { 
                ok: false, 
                error: true
            };
        }
    }

    static async logout(): Promise<ApiResponse<null>> {
        try {
            await AsyncStorage.removeItem("session");
            return { ok: true };
        } catch (e) {
            return { error: true };
        }
    }
}

export default AuthService;