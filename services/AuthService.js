import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthService {
	static async getSession() {
		try {
			const session = await AsyncStorage.getItem("session");
			return session ? JSON.parse(session) : null;
		} catch (e) {
			return { error: e };
		}
	}

	static async login(email, password) {
		const session = { id: 1, token: "" };
		await AsyncStorage.setItem("session", JSON.stringify(session));
		return { ok: true, data: session };
	}

	static async logout() {
		try {
			await AsyncStorage.removeItem("session");
			return { ok: true };
		} catch (e) {
			return { error: e };
		}
	}
}

export default AuthService;
