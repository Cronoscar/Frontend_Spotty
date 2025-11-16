import { ScrollView, TouchableOpacity, StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useSpotBooking } from "@/contexts/SpotBookingContext";

export default function() {
	const [cardNumber, setCardNumber] = useState<string>("");
	const [expirationDate, setExpirationDate] = useState<string>("");
	const [CVV, setCVV] = useState<string>("");
	const [cardOwner, setCardOwner] = useState<string>("");
	const router = useRouter();

	const { data, setData } = useSpotBooking();

	useEffect(function() {
		setData({
			...data,
			cardNumber: cardNumber,
			expirationDate: expirationDate,
			CVV: CVV,
			cardOwner: cardOwner,
		});
	}, [cardNumber, expirationDate, CVV, cardOwner]);

	return (
		<SafeAreaView style={ styles.safeArea }>
			<TouchableOpacity
				style={{ alignSelf: "flex-start", paddingBottom: 10, }}
				onPress={ () => router.back() }
			>
				<Ionicons
					style={ styles.backButton }
					name="arrow-back-outline"
					size={ 20 }
				/>
			</TouchableOpacity>
			<ScrollView
				contentContainerStyle={{ padding: 15 }}
			>
				<View style={ styles.container }>
					<Text style={ styles.title }>Detalles del Pago</Text>
					<Text style={ styles.subtitle }>Ingresa tu información de pago</Text>
				</View>
				<View style={ styles.paymentDetailsContainer }>
					<Text>Número de Tarjeta</Text>
					<View style={ styles.divInput }>
						<Ionicons
							name="card-outline"
							size={ 20 }
						/>
						<TextInput
							style={{ flex: 1, marginLeft: 5, }}
							value={ cardNumber }
							onChangeText={ setCardNumber }
							placeholder="1234 5678 9012 3456"
							keyboardType="number-pad"
							maxLength={10}
						/>
					</View>
					<View style={{ flexDirection: "row", marginVertical: 20, gap: 20, }}>
						<View style={{ flex: 1, }}>
							<Text>Fecha de Expiración</Text>
							<TextInput
								style={ styles.input }
								value={ expirationDate }
								onChangeText={ setExpirationDate }
								placeholder="MM/AA"
								keyboardType="number-pad"
								maxLength={10}
							/>
						</View>
						<View style={{ flex: 1, }}>
							<Text>CVV</Text>
							<TextInput
								style={ styles.input }
								value={ CVV }
								onChangeText={ setCVV }
								placeholder="1234"
								keyboardType="number-pad"
								maxLength={10}
							/>
						</View>
					</View>
					<Text>Dueño de la Tarjeta</Text>
					<TextInput
						style={ styles.input }
						value={ cardOwner }
						onChangeText={ setCardOwner }
						placeholder="Oscar Estrada"
						keyboardType="default"
						maxLength={10}
					/>
				</View>
				<View style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 20, }}>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
						<Text>Subtotal (2 horas)</Text>
						<Text>${ data?.subtotal ?? 0 }</Text>
					</View>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
						<Text>ISV</Text>
						<Text>${ data?.isv ?? 0 }</Text>
					</View>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
						<Text>Total</Text>
						<Text>${ data?.total ?? 0 }</Text>
					</View>
				</View>
				{
					cardNumber && expirationDate && CVV && cardOwner && (
						<TouchableOpacity
							onPress={ () => router.push("/spotBooking/bookingDetails") }
							style={ styles.button }
						>
							<Text style={ styles.buttonText }>Reservar</Text>
						</TouchableOpacity>
					)
				}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	container: {
	},
	backButton: {
		backgroundColor: "#88CFE7",
		color: "#275C9C",
		borderRadius: 100,
		padding: 10,
	},
	title: {
		fontWeight: "bold",
		fontSize: 20,
	},
	subtitle: {
		fontSize: 15,
		color: "gray",
		marginVertical: 10,
		marginHorizontal: 15,
	},
	paymentDetailsContainer: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		marginVertical: 25,
		paddingBottom: 35,
	},
	divInput: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 10,
		marginTop: 10,
		paddingVertical: 5,
	},
	input: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		marginTop: 10,
	},
	button: {
		alignSelf: "center",
		backgroundColor: "#275C9C",
		paddingVertical: 10,
		paddingHorizontal: 25,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
	},
});