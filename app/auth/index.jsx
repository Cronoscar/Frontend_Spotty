import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const AuthScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const { session, login } = useAuth();

	const handleAuth = async () => {
		if (loading) {
			return;
		}

		if (!email.trim() || !password.trim()) {
			setError("Ingresar credenciales");
			return;
		}

		setError("");

		setLoading(true);

		const res = await login(email, password);

		console.log(res);

		if (res.ok) {
			router.replace("/(tabs)/profile");
		} else {
			Alert.alert("Error iniciando sesión", "Inténtelo nuevamente.");
		}

		setLoading(false);
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<View style={ styles.header }>
				<Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
					Inicia sesión
				</Text>
			</View>
			<View style={ styles.container }>
				<View style={{ height: 50, }}>
					{
						error && (
							<Text
								style={{
									backgroundColor: "red",
									color: "pink",
									paddingVertical: 5,
									paddingHorizontal: 20,
									borderRadius: 10,
									fontSize: 15,
									marginBottom: 10,
								}}
							>
								{ error }
							</Text>
						)
					}
				</View>
				<View style={ styles.form }>
					<Text style={ styles.label }>Correo electrónico</Text>
					<TextInput
						placeholder="correo@abc.com"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
						style={ styles.input }
					/>
					<Text style={ styles.label }>Contraseña</Text>
					<TextInput
						placeholder="Contraseña"
						secureTextEntry
						autoCapitalize="none"
						value={password}
						onChangeText={setPassword}
						style={ styles.input }
					/>
					<TouchableOpacity
						style={ styles.button }
						onPress={handleAuth}
					>
						<Text style={ styles.buttonText }>Iniciar sesion</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		backgroundColor: "#275C9C",
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		paddingTop: 70,
		paddingBottom: 16,
		paddingHorizontal: 25,
		alignItems: "center",
		flexDirection: "row",
		gap: 10,
	},
	form: {
		width: "70%",
	},
	input: {
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		marginBottom: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	button: {
		borderRadius: 10,
		backgroundColor: "#275C9C",
		paddingVertical: 4,
		paddingHorizontal: 6,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#fff",
	},
	label: {
		fontSize: 15,
		fontWeight: "bold",
	}
});

export default AuthScreen;
