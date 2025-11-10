import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const UserOptions = () => {
	const router = useRouter();
	const { logout } = useAuth();

	const handleLogout = async () => {
		const res = await logout();

		console.log(res)

		if (res?.ok) {
			router.replace("/(tabs)/");
		} else {
			Alert.alert("Error cerrando sesión", "Inténtelo nuevamente.");
		}
	};

	return (
		<ScrollView
			contentContainerStyle={ styles.userOptions }
		>
			<TouchableOpacity
					style={ styles.userOption }
					onPress={ () => {} }
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons name="person-outline" color="#275C9C" size={ 20 } />
						<Text style={ styles.userOptionText }>Editar perfil</Text>
					</View>
					<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
			</TouchableOpacity>

			<TouchableOpacity
					style={ styles.userOption }
					onPress={ () => {} }
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons name="card-outline" color="#275C9C" size={ 20 } />
						<Text style={ styles.userOptionText }>Métodos de pago</Text>
					</View>
					<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
			</TouchableOpacity>

			<TouchableOpacity
					style={ styles.userOption }
					onPress={ () => {} }
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons name="help-circle-outline" color="#275C9C" size={ 20 } />
						<Text style={ styles.userOptionText }>Ayuda y soporte</Text>
					</View>
					<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
			</TouchableOpacity>


			<TouchableOpacity
					style={ styles.userOption }
					onPress={ () => {} }
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons name="settings-outline" color="#275C9C" size={ 20 } />
						<Text style={ styles.userOptionText }>Configuración</Text>
					</View>
					<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
			</TouchableOpacity>


			<TouchableOpacity
					style={{ ...styles.userOption, borderColor: "red" }}
					onPress={handleLogout}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons name="log-out-outline" color="red" size={ 20 } />
						<Text style={{ ...styles.userOptionText, color: "red" }}>Cerrar sesión</Text>
					</View>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	userOptions: {
		alignItems: "center",
	},
	userOption: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "85%",
		paddingVertical: 20,
		paddingHorizontal: 15,
		marginBottom: 15,
	},
	userOptionText: {
		marginLeft: 10,
		fontSize: 15,
	}
});

export default UserOptions;
