import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

import SpotList from "@/components/SpotList";

import { Spot } from "@/types/spot";

const exampleSpots: Spot[] = [
	{
		id: 1,
		title: "Mall Multiplaza (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2, // km
		stars: 4.7,
		price: 35,
		image: "",
	},
	{
		id: 2,
		title: "Mall Multiplaza (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2, // km
		stars: 4.7,
		price: 35,
		image: "",
	},
	{
		id: 3,
		title: "Mall Multiplaza (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2, // km
		stars: 4.7,
		price: 35,
		image: "",
	},
	{
		id: 4,
		title: "Mall Multiplaza (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2, // km
		stars: 2.7,
		price: 35,
		image: "",
	},
];

export default function() {
	const [loading, setLoading] = useState<boolean>(true);
	const [spots, setSpots] = useState<Spot[]>([]);

	useEffect(() => {
		setTimeout(() => {
			setSpots( exampleSpots );
			setLoading(false);
		}, 3000);
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<View style={ styles.header } >
				<Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
					Bienvenido
				</Text>
			</View>
			<View style={ styles.container } >
				{
					loading
						? <ActivityIndicator size="large" color="#275C9C" />
						: <SpotList spots={ spots }/>
				}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#275C9C",
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		paddingTop: 70,
		paddingBottom: 16,
		paddingHorizontal: 25,
		alignItems: "center",
		// justifyContent: "center",
		flexDirection: "row",
		gap: 10,
	},
	container: {
		marginTop: 20,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
	},
	image: {
		width: 100,
		height: 100,
		marginBottom: 20,
		borderRadius: 10,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 20,
	},
	button: {
		backgroundColor: "#007bff",
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	centeredContainter: {
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
});
