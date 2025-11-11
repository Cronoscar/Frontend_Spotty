import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Form } from "@/config/enums";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";

const AuthScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState(Form.REGISTER);
	const router = useRouter();
	const { session, login } = useAuth();

	useEffect(() => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			router.replace("/");
			return true;
		});
		return () => backHandler.remove();
	}, []);

	const handleRegister = async () => {
	};

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
				<TouchableOpacity
					onPress={() => router.replace("/")}
				>
					<Ionicons name="arrow-back-circle-outline" color="#fff" size={ 35 } />
				</TouchableOpacity>
				<Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
					{
						form == Form.LOGIN
							? "Inicia sesión"
							: "Regístrate"
					}
				</Text>
			</View>
			<View style={ styles.container }>
				<View style={ styles.form }>
					{
						form == Form.LOGIN
							? (
								<LoginForm
									email = { email }
									setEmail = { setEmail }
									password = { password }
									setPassword = { setPassword }
									handleAuth={ handleAuth }
									setForm={ setForm }
								/>
							) : (
								<RegisterForm
									email = { email }
									setEmail = { setEmail }
									password = { password }
									setPassword = { setPassword }
									handleRegister={ handleRegister }
									setForm={ setForm }
								/>
							)
					}
				</View>
				<View style={{ height: 50, }}>
					{ error && <Text style={ styles.error }>{ error }</Text> }
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
	error: {
		backgroundColor: "red",
		color: "pink",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontSize: 15,
		fontWeight: "bold",
	}
});

export default AuthScreen;
