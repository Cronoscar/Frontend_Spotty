import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export default function() {
	const { logout } = useAuth();

	const router = useRouter();

	return(
		<View
			style={{
				flex:1,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Pressable
				style={{
					flex:1,
					alignItems: "center",
					justifyContent: "center",
				}}
			 	onPress={ () => {
					logout();
					router.replace("/");
				}}
			>
				<Text style={{ fontSize: 100 }}>Sign out</Text>
			</Pressable>
		</View>
	);
}