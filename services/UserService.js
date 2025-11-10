import useApi from "@/utils/useApi";

class UserService {
	static async getUser(id) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					fullName: "Jose Bautista",
					email: "correo@gmail.com",
					bookings: 12,
					expenses: 250,
					favorites: 3,
				});
			}, 3000);
		});
	}
}

export default UserService;
