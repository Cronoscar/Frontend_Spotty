import { View, Text, StyleSheet, BackHandler, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import { Form } from "@/config/enums";

import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";

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
		<View style={{ flex: 1, backgroundColor: "#fff", }}>
			<Header
				title={
					form == Form.LOGIN
						? "Inicia sesión"
						: "Regístrate"
				}
				backAction={ () => router.replace("/") }
			/>
			<ScrollView style={ styles.container }>
				<Image source={ Logo } style={ styles.logo } />
				<View style={ styles.form }>
					{
						form == Form.LOGIN
							? <LoginForm setError={ setError } setForm={ setForm }/>
							: <RegisterForm setError={ setError } setForm={ setForm }/>
					}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	form: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		padding: 15,
		margin: 15,
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
		height: 350,
		maxHeight: 350,
		maxWidth: 250,
		marginVertical: 30,
		marginHorizontal: "auto",
	}
});
