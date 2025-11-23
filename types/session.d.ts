import { UserRole } from "@/config/enums";

export type Session = {
		id: number;
		token: string;
		role: UserRole;
};
