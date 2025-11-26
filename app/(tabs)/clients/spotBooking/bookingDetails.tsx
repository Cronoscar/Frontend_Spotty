import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useSpotBooking } from "@/contexts/SpotBookingContext";

import Configuration from "@/config/constants";

export default function() {
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { data } = useSpotBooking();

	useEffect(function() {
		console.log(data);
		setTimeout(function() {
			setLoading(false);
		}, 500);
	}, []);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					marginVertical: 15,
				}}
			>
				<ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
			</View>
		);
	}
	
	return (
		<SafeAreaView style={ styles.safeArea }>
			<Ionicons
				style={{ alignSelf: "center", color: "#16A249" }}
				name="checkmark-done-circle-outline"
				size={ 200 }
			/>
			<View style={{ alignItems: "center", }}>
				<Text style={{ fontWeight: "bold", fontSize: 30, }}>Reserva Confirmada</Text>
				<Text style={{ color: "gray", fontWeight: "bold", }}>Su plaza de parqueo está asegurada</Text>
			</View>
			<Ionicons
				style={{ alignSelf: "center", marginVertical: 25, }}
				name="qr-code-outline"
				size={ 150 }
			/>
			<View
				style={{
					borderColor: "lightgray",
					borderWidth: 1,
					borderRadius: 10,
					padding: 20,
					marginBottom: 20,
					marginHorizontal: 15,
					}}
			>
				<View style={ styles.infoField }>
					<Text>ID Reserva</Text>
					<Text>1111</Text>
				</View>
				<View style={ styles.infoField }>
					<Text>Ubicación</Text>
					<Text>{ data?.location }</Text>
				</View>
				<View style={ styles.infoField }>
					<Text>Espacio</Text>
					<Text>{ data?.position }</Text>
				</View>
				<View style={ styles.infoField }>
					<Text>Fecha</Text>
					<Text>{ data?.date }</Text>
				</View>
				<View style={ styles.infoField }>
					<Text>Tiempo</Text>
					<Text>{ data?.time }</Text>
				</View>
			</View>
			<TouchableOpacity
				onPress={ () => router.replace("/") }
				style={ styles.button }
			>
				<Text style={ styles.buttonText }>Regresar</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 20,
		paddingHorizontal: 15,
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
	infoField: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	}
});