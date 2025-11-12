import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Form } from "@/config/enums";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";

const AuthScreen = () => {
	const [form, setForm] = useState(Form.REGISTER);
	const [error, setError] = useState("");
	const router = useRouter();

	useEffect(() => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", function() {
			router.replace("/");
			return true;
		});
		return () => backHandler.remove();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<Header
				title={
					form == Form.LOGIN
						? "Inicia sesión"
						: "Regístrate"
				}
				backAction={ () => router.replace("/") }
			/>
			<View style={ styles.container }>
				<View style={ styles.form }>
					{
						form == Form.LOGIN
							? <LoginForm setError={ setError } setForm={ setForm }/>
							: <RegisterForm setError={ setError } setForm={ setForm }/>
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
