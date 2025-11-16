import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSpotBooking } from "@/contexts/SpotBookingContext";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function() {
	const router = useRouter();
	const { data } = useSpotBooking();

	useEffect(function() {
		console.log(data);
	}, []);
	
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
			<View style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 20, }}>
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
					<Text>ID Reserva</Text>
					<Text>1111</Text>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
					<Text>Ubicación</Text>
					<Text>{ data?.location }</Text>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
					<Text>Espacio</Text>
					<Text>{ data?.position }</Text>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
					<Text>Fecha</Text>
					<Text>{ data?.date }</Text>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
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
	}
});