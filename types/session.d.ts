// types/session.ts
import { UserRole } from "@/config/enums";

export type Session = {
    id: number | null;
    token: string | null;
    role: UserRole;
    userData?: any; // Agregar esto para datos adicionales
};