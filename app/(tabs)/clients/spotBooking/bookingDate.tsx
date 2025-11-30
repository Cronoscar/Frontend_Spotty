import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useSpotBooking } from "@/contexts/SpotBookingContext";

import Configuration from "@/config/constants";

function formatDate(text: string) {
	let cleaned = text.replace(/[^\d]/g, "");

	if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
	if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + "/" + cleaned.slice(5, 9);

	return cleaned.slice(0, 10);
}

function formatTime(text: string) {
	let cleaned = text.toUpperCase().replace(/[^0-9APM]/g, "");

	// Insertar :
	if (cleaned.length > 2 && cleaned[2] !== ":") {
		cleaned = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
	}

	// AM/PM
	if (cleaned.length > 5) {
		let time = cleaned.slice(0, 5); // HH:MM
		let suffix = cleaned.slice(5).replace(/[^APM]/g, "");

		if (suffix.startsWith("A")) suffix = "AM";
		if (suffix.startsWith("P")) suffix = "PM";

		cleaned = time + " " + suffix;
	}

	return cleaned.slice(0, 8);
}

export default function() {
	const { data, setData } = useSpotBooking();

	const [date, setDate] = useState<string>(data?.date || "");
	const [startTime, setStartTime] = useState<string>(data?.startTime || "");
	const [endTime, setEndTime] = useState<string>(data?.endTime || "");
	const [total, setTotal] = useState<number>(10);

	const router = useRouter();

	useEffect(function() {
		const start = !startTime ? 0 : parseInt(startTime);
		const end = !endTime ? 0 : parseInt(endTime);

		setData({
			...data,
			date: date,
			startTime: startTime,
			endTime: endTime,
			time: end - start,
			total: total,
			isv: total * 0.15,
			subtotal: total - (total * 0.15),
		});
	}, [date, startTime, endTime]);

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
					<Text style={ styles.title }>Selecciona fecha y hora</Text>
					<Text style={ styles.subtitle }>Elige el cuanto vas a parquear</Text>
				</View>
				<View style={ styles.locationContainer }>
					<Text style={ styles.spotTitle }>{ data?.title }</Text>
					<Text style={ styles.spotLocation }>{ data?.location }</Text>
				</View>
				{/* FORM */}
				<View style={ styles.form }>
					<Text>Fecha</Text>
					<View style={ styles.input }>
						<Ionicons name="calendar-outline" size={20} />
						<TextInput
							style={{ flex: 1, marginLeft: 5 }}
							value={date}
							onChangeText={txt => setDate(formatDate(txt))}
							placeholder="mm/dd/yyyy"
							keyboardType="number-pad"
							maxLength={10}
						/>
					</View>
				
					<View style={{ flexDirection: "row", gap: 25, marginTop: 15 }}>
						<View style={{ flex: 1 }}>
							<Text>Hora inicio</Text>
							<View style={ styles.input }>
								<Ionicons name="time-outline" size={20} />
								<TextInput
									style={{ flex: 1, marginLeft: 5 }}
									value={startTime}
									onChangeText={txt => setStartTime(formatTime(txt))}
									placeholder="08:30 AM"
									keyboardType="number-pad"
									maxLength={8}
								/>
							</View>
						</View>
				
						<View style={{ flex: 1 }}>
							<Text>Hora fin</Text>
							<View style={ styles.input }>
								<Ionicons name="time-outline" size={20} />
								<TextInput
									style={{ flex: 1, marginLeft: 5 }}
									value={endTime}
									onChangeText={txt => setEndTime(formatTime(txt))}
									placeholder="08:30 PM"
									keyboardType="number-pad"
									maxLength={8}
								/>
							</View>
						</View>
					</View>
				</View>
				{
					date && startTime && endTime && (
						<TouchableOpacity
							onPress={ () => router.push("/clients/spotBooking/paymentMethod") }
							style={ styles.button }
						>
							<Text style={ styles.buttonText }>Continuar con el pago</Text>
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
		backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
		color: Configuration.SPOTTY_PRIMARY_COLOR,
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
	locationContainer: {
		backgroundColor: "#f5f5f5",
		marginHorizontal: 5,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	spotTitle: {
		fontWeight: "bold",
		marginBottom: 5,
	},
	spotLocation: {
		fontWeight: "bold",
		color: "gray",
	},
	form: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		marginVertical: 25,
		paddingBottom: 30,
	},
	input: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 10,
		marginTop: 10,
		paddingVertical: 5,
	},
	amountContainer: {
		flexDirection: "row",
		borderColor: "#275C9C",
		borderRadius: 10,
		borderWidth: 1,
		backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
		alignItems: "center",
		marginHorizontal: 25,
		marginTop: 35,
		marginBottom: 15,
		paddingHorizontal: 15,
		paddingVertical: 25,
	},
	amountLabel: {
		fontWeight: "bold",
		color: Configuration.SPOTTY_PRIMARY_COLOR,
		fontSize: 25,
	},
	button: {
		alignSelf: "center",
		backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
		paddingVertical: 10,
		paddingHorizontal: 25,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
	}
});
