import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, BackHandler, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";
import Header from "@/components/Header";

import { UserData } from "@/types/user";

import Configuration from "@/config/constants";

import ProfilePicture from "@/assets/images/333.jpg";

const user: UserData = {
	name: "Jose",
	lastName: "Bautista",
	phoneNumber: "66663333",
	email: "jose@gmail.com",
};

export default function() {
	const [loading, setLoading] = useState<boolean>(true);
	const [name, setName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const router = useRouter();

	useEffect(function() {
		setTimeout(function() {
			setName(user.name);
			setLastName(user.lastName);
			setEmail(user.email);
			setPhoneNumber(user.phoneNumber);
			setLoading(false);
		}, 3000);
	}, []);

	async function saveProfile() {
		router.back();
	}

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<Header title="Editar perfil" />
			{
				loading
					? (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
						</View>
					) : (
						<ScrollView contentContainerStyle={ styles.container }>
							<View style={{ alignItems: "center", }} >
								<View>
									<View style={{ marginBottom: 10 }}>
										<Image source={ ProfilePicture } style={ styles.userImage } />
										<Ionicons name="camera-outline" style={ styles.changeImage } />
									</View>
								</View>
								<Text>Cambiar foto</Text>
							</View>
							<View style={ styles.userData }>
								<Text style={ styles.label }>Nombres</Text>
								<TextInput
									placeholder=""
									autoCapitalize="none"
									value={ name }
									onChangeText={ setName }
									style={ styles.input }
								/>
								<Text style={ styles.label }>Apellidos</Text>
								<TextInput
									placeholder=""
									autoCapitalize="none"
									value={ lastName }
									onChangeText={ setLastName }
									style={ styles.input }
								/>
								<Text style={ styles.label }>Correo electrónico</Text>
								<TextInput
									placeholder=""
									keyboardType="email-address"
									autoCapitalize="none"
									value={ email }
									onChangeText={ setEmail }
									style={ styles.input }
								/>
								<Text style={ styles.label }>Teléfono</Text>
								<TextInput
									placeholder=""
									autoCapitalize="none"
									value={ phoneNumber }
									onChangeText={ setPhoneNumber }
									style={ styles.input }
								/>
								<TouchableOpacity
									style={ styles.button }
									onPress={ saveProfile }
								>
									<Text style={ styles.buttonText }>Guardar</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					)
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 25,
		flex: 1,
		alignItems: "center",
	},
	userImage: {
		borderRadius: 100,
		maxWidth: 120,
		maxHeight: 120,
		height: 120,
		width: 120,
	},
	userData: {
		backgroundColor: "#fff",
		width: "80%",
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		padding: 20,
		marginTop: 15,
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	input: {
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		marginBottom: 15,
		marginTop: 5,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	label: {
		fontSize: 15,
		fontWeight: "normal",
	},
	button: {
		borderRadius: 10,
		backgroundColor: "#275C9C",
		paddingVertical: 10,
		alignItems: "center",
		width: "100%",
		alignSelf: "center",
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "normal",
		color: "#fff",
	},
	changeImage: {
		position: "absolute",
		bottom: 5,
		right: 10,
		backgroundColor: "#fff",
		borderRadius: 100,
		padding: 6,
		fontSize: 15,
		color: "black",
	},
});
