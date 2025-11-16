import { View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import SpotList from "@/components/SpotList";

import { Spot } from "@/types/spot";

import Configuration from "@/config/constants";

const exampleSpots: Spot[] = [
	{
		id: 1,
		title: "Mall Multiplaza (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2,
		stars: 4.7,
		price: 35,
		image: "",
	},
	{
		id: 2,
		title: "City Mall (Tegucigalpa)",
		location: "Anillo Periférico",
		freeSpots: 8,
		distance: 2.5,
		stars: 4.3,
		price: 30,
		image: "",
	},
	{
		id: 3,
		title: "Hospital Viera",
		location: "Col. Palmira",
		freeSpots: 5,
		distance: 0.9,
		stars: 4.8,
		price: 25,
		image: "",
	},
	{
		id: 4,
		title: "Parque Central (Centro Histórico)",
		location: "Av. Colón",
		freeSpots: 3,
		distance: 0.6,
		stars: 3.9,
		price: 20,
		image: "",
	},
	{
		id: 5,
		title: "UNAH Estacionamiento Principal",
		location: "Universidad Nacional Autónoma",
		freeSpots: 15,
		distance: 1.1,
		stars: 4.6,
		price: 15,
		image: "",
	},
	{
		id: 6,
		title: "Aeropuerto Toncontín",
		location: "Blv. Fuerzas Armadas",
		freeSpots: 25,
		distance: 5.4,
		stars: 4.2,
		price: 50,
		image: "",
	},
	{
		id: 7,
		title: "Parqueo La Leona",
		location: "Barrio La Leona",
		freeSpots: 4,
		distance: 0.8,
		stars: 4.0,
		price: 18,
		image: "",
	},
	{
		id: 8,
		title: "Mall Las Cascadas",
		location: "Blv. Centroamérica",
		freeSpots: 12,
		distance: 1.7,
		stars: 4.5,
		price: 28,
		image: "",
	},
	{
		id: 9,
		title: "Galerías del Valle (San Pedro Sula)",
		location: "Blv. del Norte",
		freeSpots: 20,
		distance: 4.1,
		stars: 4.9,
		price: 40,
		image: "",
	},
	{
		id: 10,
		title: "Estacionamiento Hotel Clarion",
		location: "Col. Alameda",
		freeSpots: 7,
		distance: 1.4,
		stars: 4.4,
		price: 35,
		image: "",
	},
];


export default function() {
	const [loading, setLoading] = useState<boolean>(false);
	const [searchBox, setSearchBox] = useState<string>("");
	const [spots, setSpots] = useState<Spot[]>([]);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}, [spots]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!searchBox) {
				setSpots([]);
				return;
			}

			setLoading(true);
			setSpots(exampleSpots.filter(spot => new RegExp(`.*${searchBox}.*`, "i").test(spot.title)));
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchBox]);

	return (
		<SafeAreaView style={ styles.safeArea }>
			<View style={ styles.container }>
				<TextInput
					style={styles.input}
					placeholder="Buscar establecimiento"
					placeholderTextColor="gray"
					value={searchBox}
					onChangeText={setSearchBox}
				/>
				<Ionicons name="search" size={20} color="#999" />
			</View>
			<View style={ styles.spots }>
				{
					loading
						? <ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
						: <SpotList spots={ spots }/>
				}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		alignItems: "center",
	},
	container: {
		width: "85%",
		flexDirection: "row",
		// justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		backgroundColor: "lightgray",
		borderRadius: 20,
		paddingHorizontal: 15,
	},
	input: {
		flex: 2,
		paddingVertical: 10,
	},
	spots: {
		flex: 1,
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center",
	},
});
