import { View, Text, StyleSheet, BackHandler, ScrollView, Image, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import { Form, UserType } from "@/config/enums";

import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";

import Logo from "@/assets/images/logo.png";

import Configuration from "@/config/constants";

export default function () {
	const [form, setForm] = useState<Form>(Form.REGISTER);
	const [userType, setUserType] = useState<UserType>(UserType.USER);
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
				<View style={ styles.userTypeButtons }>
					<TouchableOpacity
						onPress={ () => setUserType(UserType.USER) }
						style={{
							...styles.userTypeButton,
							...( userType === UserType.COMMERCE ? { backgroundColor: "#f5f5f5", borderColor: "lightgray" } : {} )
						}}
					>
						<Text style={ styles.userTypeTitle }>Usuario</Text>
						<Text>Reservar espacios</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={ () => setUserType(UserType.COMMERCE) }
						style={{
							...styles.userTypeButton,
							...( userType === UserType.USER ? { backgroundColor: "#f5f5f5", borderColor: "lightgray" } : {} )
						}}
					>
						<Text style={ styles.userTypeTitle }>Comercio</Text>
						<Text>Gestionar parqueo</Text>
					</TouchableOpacity>
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
	},
	userTypeButtons: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		margin: 20,
		gap: 10,
		marginBottom: 80,
	},
	userTypeButton: {
		flex: 1,
		alignItems: "center",
		padding: 10,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
		backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
	},
	userTypeTitle: {
		fontWeight: "bold",
		fontSize: 18,
	}
});
