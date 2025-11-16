import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Configuration from "@/config/constants";

const api = axios.create({
	baseURL: Configuration.API_BASE_URL,
});

function useApi() {
	const { session } = useAuth();

	api.interceptors.request.use(config => {
		if (session?.token) {
			config.headers.Authorization = `Bearer ${ session.token }`;
		}

		return config;
	});

	return api;
}

export default useApi;
