import AsyncStorage from "@react-native-async-storage/async-storage";

import { ApiResponse } from "@/types/api";
import { Session } from "@/types/session";

import { UserRole } from "@/config/enums";

class AuthService {
	static async getSession(): Promise<ApiResponse<Session>> {
		try {
			const session = await AsyncStorage.getItem("session");

			if (!session) {
				throw Error();
			}

			return { ok: true, data: JSON.parse(session) };
		} catch (e) {
			return { error: true };
		}
	}

	static async login( email: string , password: string ): Promise<ApiResponse<Session>> {
		const session: Session = { id: 1, token: "", role: UserRole.AUTHENTICATED_USER };
		if (email.trim() === "admin") session["role"] = 3;
		await AsyncStorage.setItem("session", JSON.stringify(session));
		return { ok: true, data: session };
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
