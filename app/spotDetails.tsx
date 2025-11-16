import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import BookingService from "@/services/BookingService";
import ReviewList from "@/components/ReviewList";

import { SpotDetails } from "@/types/spot";

import SpotImage from "@/assets/images/333.jpg";

const spotExample: SpotDetails = {
	id: 1,
	title: "Estacionamiento Centro",
	location: "Boulevard Morazán, Tegucigalpa Boulevard Morazán, Tegucigalpa Boulevard Morazán, Tegucigalpa",
	freeSpots: 5,
	totalSpots: 25,
	distance: 1.2,
	stars: 4.6,
	price: 35,
	nReviews: 3,
	reviews: [
		{
			id: 1,
			userName: "Carlos Pérez",
			title: "Buen lugar",
			content: "Seguro, bien ubicado y fácil de entrar. Muy recomendado.",
		},
		{
			id: 2,
			userName: "Ana Martínez",
			title: "Cómodo pero algo lleno",
			content: "El lugar es seguro y limpio, pero a veces cuesta encontrar espacio.",
		},
		{
			id: 3,
			userName: "Luis Fernández",
			title: "Excelente servicio",
			content: "El personal es amable y el precio razonable. Definitivamente volveré.",
		}
	]
};

export default function() {
	const [loading, setLoading] = useState<boolean>(true);
	const [spot, setSpot] = useState<SpotDetails | null>(null);
	const router = useRouter();

	const { id } = useLocalSearchParams();

	const spotPercentageUse: number = spot ? (spot.totalSpots - spot.freeSpots) / spot.totalSpots * 100 : 0;

	useEffect(function() {
		setSpot(spotExample);
		setLoading(false);
	}, []);

	return loading
		? (
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
		) : (
			<View style={{ flex: 1, backgroundColor: "#fff" }}>
				<View style={ styles.header }>
					<Text style={ styles.spotPrice }>L.{ spot?.price }/hr</Text>
					<Image
						source={ spot?.image || SpotImage }
						style={ styles.spotImage }
					/>
				</View>
				<View style={ styles.spotDetails }>
					<Text style={ styles.title }>{ spot?.title }</Text>
					<View style={ styles.spotMeta }>
						<Ionicons name="star" size={ 13 } color="#275C9C" />
						<Text> { spot?.stars }</Text>
						<Text style={{ marginLeft: 10, marginRight: 20, }}>({ spot?.nReviews } Reseñas)</Text>
						<Ionicons name="location-outline" size={ 15 } color="gray" />
						<Text> a { spot?.distance } km</Text>
					</View>
					<View style={ styles.spotAvailability }>
						<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
							<Text>Disponibilidad</Text>
							<Text style={ styles.locationFreeSpots }>{ spot?.freeSpots } cupos disponibles</Text>
						</View>
						<View style={ styles.availabilityBar}>
							<View
								style={{
									...styles.availabilityBarFill,
									width: `${ spotPercentageUse }%`
								}}
							></View>
						</View>
					</View>
					<View style={{}}>
						<Text style={ styles.locationText }>Ubicación</Text>
						<View style={{ flexDirection: "row", alignItems: "center", }}>
							<Ionicons name="location-outline" size={ 15 } color="gray" />
							<Text style={ styles.locationContent }>{ spot?.location }</Text>
						</View>
						<TouchableOpacity
							onPress={ () => router.push(`/spotBooking?id=${ id }`) }
							style={ styles.button }
						>
							<Text style={ styles.buttonText }>Reservar Espacio</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={ styles.reviews }>
					<ReviewList reviews={ spot?.reviews ?? [] } />
				</View>
			</View>
		);
}

const styles = StyleSheet.create({
	header: {
		position: "relative",
		height: "25%",
	},
	spotPrice: {
		position: "absolute",
		bottom: 10,
		right: 10,
		zIndex: 2,
		backgroundColor: "white",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
		fontWeight: "bold",
		fontSize: 12,
	},
	spotImage: {
		width: "100%",
		maxWidth: "100%",
		maxHeight: "100%",
		zIndex: 1,
	},
	spotDetails: {
		marginVertical: 10,
		marginHorizontal: 20,
	},
	title: {
		fontWeight: "bold",
		fontSize: 20,
		marginBottom: 5,
	},
	spotMeta: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
	spotAvailability: {
		padding: 15,
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginBottom: 15,
	},
	locationFreeSpots: {
		backgroundColor: "#88CFE7",
		color: "#275C9C",
		borderRadius: 15,
		paddingVertical: 5,
		paddingHorizontal: 15,
		fontSize: 12,
	},
	availabilityBar: {
		backgroundColor: "lightgray",
		height: 7,
		marginTop: 10,
		borderRadius: 20,
		zIndex: 1,
	},
	availabilityBarFill: {
		height: "100%",
		backgroundColor: "#275C9C",
		borderRadius: 20,
		width: "40%",
		zIndex: 2,
	},
	locationText: {
		fontWeight: "bold",
		marginBottom: 5,
	},
	locationContent: {
		fontSize: 12,
		marginLeft: 5,
		color: "gray"
	},
	button: {
		marginTop: 15,
		backgroundColor: "#275C9C",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 5,
		borderRadius: 10,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	reviews: {
		flex: 1,
		padding: 10,
		backgroundColor: "#f5f5f5",
		margin: 10,
		borderRadius: 10,
	}
});
