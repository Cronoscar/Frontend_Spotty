import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import useApi from "@/utils/useApi";

class UserService {
	static async getUser( id: number ): Promise<ApiResponse<User>> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					ok: true,
					data: {
						fullName: "Jose Bautista",
						email: "correo@gmail.com",
						bookings: 12,
						expenses: 250,
						favorites: 3,
					}
				});
			}, 3000);
		});
	}
}

export default UserService;
