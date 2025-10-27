import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import SpotList from "@/components/SpotList";

const HomeScreen = () => {
	const [loading, setLoading] = useState(true);
	const [spots, setSpots] = useState([]);

	useEffect(() => {
		setSpots([
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
		]);
		setLoading(false);
	}, []);

	return (
		<View style={ styles.container } >
			{
				loading
					? <Text>Loading...</Text>
					: (
						<>
							<SpotList spots={ spots }/>
						</>
					)
			}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#f8f9fa",
		width: "90vw",
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

export default HomeScreen;
