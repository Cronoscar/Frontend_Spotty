import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Form } from "@/config/enums";

const LoginForm = ({ email, setEmail, password, setPassword, handleAuth, setForm }) => (
	<>
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
				onPress={ handleAuth }
			>
				<Text style={ styles.buttonText }>Iniciar sesión</Text>
			</TouchableOpacity>
			<Text
				onPress={ () => setForm(Form.REGISTER) }
				style={{
					marginTop: 15
				}}
			>
				¿No tienes cuenta? <Text style={{ fontWeight: "bold", color: "#275C9C" }}>¡Regístrate!</Text>
			</Text>
		</View>
	</>
);

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
		width: "60%"
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

export default LoginForm;
