import { View, Text, StyleSheet, BackHandler, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import { Form } from "@/config/enums";

import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";

import Configuration from "@/config/constants";

import Logo from "@/assets/images/logo.png";

export default function () {
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

	useEffect(function() {
		if (!error) return;

		Alert.alert("Error", error);
	}, [error]);

	return (
		<View style={{ flex: 1, backgroundColor: "#fff", maxHeight: "55%" }}>
			<Header
				title={
					form == Form.LOGIN
						? "Inicia sesión"
						: "Regístrate"
				}
				backAction={ () => router.replace("/") }
			/>
			<View style={ styles.container }>
				<Image source={ Logo } style={ styles.logo } />
				<View 
					style={{
						borderColor: "lightgray",
						borderWidth: 1,
						borderRadius: 10,
						padding: 15,
					}}
				>
					<ScrollView contentContainerStyle={ styles.form }>
						{
							form == Form.LOGIN
								? <LoginForm setError={ setError } setForm={ setForm }/>
								: <RegisterForm setError={ setError } setForm={ setForm }/>
						}
					</ScrollView>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "80%",
		alignSelf: "center",
	},
	form: {
	},
	error: {
		backgroundColor: "red",
		color: "pink",
		paddingVertical: 5,
		paddingHorizontal: 20,
		borderRadius: 10,
		fontSize: 15,
		fontWeight: "bold",
	},
	logo: {
		width: 250,
		height: 250,
		maxHeight: 250,
		maxWidth: 250,
		marginVertical: 30,
		marginHorizontal: "auto",
	}
});
