import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import SpotsGrid from "@/components/SpotsGrid";

const exampleSpot = {
	title: "Metro Mall",
	location: "Col. Las Brisas",
}

const N_ROWS = 4;
const N_COLUMNS = 9;
const SPOTS_STATUS = "101011001010111011010010110111010001";

export default function() {
	const [loading, setLoading] = useState(true);
	const [spot, setSpot] = useState(null);
	const router = useRouter();

	useEffect(function() {
		setTimeout(function() {
			setSpot(exampleSpot);
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
				<ActivityIndicator size="large" color="#275C9C" />
			</View>
		);
	}

	return (
		<SafeAreaView style={ styles.safeArea }>
			<TouchableOpacity
				style={{
					alignSelf: "flex-start"
				}}
				onPress={ () => router.back() }
			>
				<Ionicons
					style={ styles.backButton }
					name="arrow-back-outline"
					size={ 20 }
				/>
			</TouchableOpacity>
			<View style={ styles.container }>
				<Text style={ styles.title }>Selecciona tu espacio</Text>
				<Text style={ styles.subtitle }>Elige tu plaza preferida</Text>
			</View>
			<View style={ styles.locationContainer }>
				<Text style={ styles.spotTitle }>{ spot.title }</Text>
				<Text style={ styles.spotLocation }>{ spot.location }</Text>
			</View>
			<Text style={ styles.label0 }>Seleccione tu espacio de parqueo</Text>
			<Text style={ styles.label1 }>(Los espacios reservados se marcan en rojo)</Text>
			<View style={ styles.colorHints }>
				<View style={{ ...styles.colorSquare, backgroundColor: "#16A249", }}></View>
				<Text>Disponible</Text>
				<View style={{ ...styles.colorSquare, backgroundColor: "#ef4444", }}></View>
				<Text>Reservado</Text>
				<View style={{ ...styles.colorSquare, backgroundColor: "#275C9C", }}></View>
				<Text>Seleccionado</Text>
			</View>
			<SpotsGrid
				spots={ SPOTS_STATUS }
				nColumns={ N_COLUMNS }
			/>
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
		padding: 15,
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
	label0: {
		marginTop: 25,
		alignSelf: "center",
		fontWeight: "bold",
		color: "gray",
		fontSize: 15,
	},
	label1: {
		alignSelf: "center",
		marginTop: 10,
		fontSize: 10
	},
	colorHints: {
		marginTop: 35,
		marginBottom: 25,
		alignSelf: "center",
		flexDirection: "row",
		gap: 8,
	},
	colorSquare: {
		width: 20,
		height: 20,
		borderRadius: 5,
	}
});
