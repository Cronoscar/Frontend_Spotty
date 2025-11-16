import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Form } from "@/config/enums";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { RegisterFormProps } from "@/types/component";

export default function RegisterForm({ setError, setForm }: RegisterFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { session, login } = useAuth();
	const router = useRouter();

	async function handleRegister() {
	}

	return (
		<>
			<Text style={ styles.label }>Nombre</Text>
			<TextInput
				placeholder="Nombre"
				autoCapitalize="none"
				value={ "" }
				onChangeText={ () => {} }
				style={ styles.input }
			/>
			<Text style={ styles.label }>Correo electrónico</Text>
			<TextInput
				placeholder="correo@abc.com"
				keyboardType="email-address"
				autoCapitalize="none"
				value={ email }
				onChangeText={ setEmail }
				style={ styles.input }
			/>
			<Text style={ styles.label }>Contraseña</Text>
			<TextInput
				placeholder="Contraseña"
				secureTextEntry
				autoCapitalize="none"
				value={ password }
				onChangeText={ setPassword }
				style={ styles.input }
			/>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					marginTop: 10,
				}}
			>
				<TouchableOpacity
					style={ styles.button }
					onPress={ handleRegister }
				>
					<Text style={ styles.buttonText }>Registrarse</Text>
				</TouchableOpacity>
				<Text
					onPress={ () => setForm(Form.LOGIN) }
					style={{
						marginVertical: 15
					}}
				>
					¿Ya tienes cuenta? <Text style={{ fontWeight: "bold", color: "#275C9C" }}>¡Inicia sesión!</Text>
				</Text>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	input: {
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		marginBottom: 10,
		marginTop: 5,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	button: {
		borderRadius: 10,
		backgroundColor: "#275C9C",
		paddingVertical: 10,
		alignItems: "center",
		width: "60%",
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#fff",
	},
	label: {
		fontSize: 15,
		fontWeight: "bold",
	},
});
