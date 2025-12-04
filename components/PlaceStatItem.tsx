// components/PlaceStatItem.tsx
import { Pressable, View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { PlaceStatItemProps } from "@/types/component";

// Remueve la importación de la imagen local
// import PlaceImage from "@/assets/images/commerce.png";

export default function PlaceStatItem({
	id,
	title,
	location,
	price,
	availableSpots,
	totalSpots,
	schedule,
	img // Agrega esta prop
}: PlaceStatItemProps) {
	const router = useRouter();

	// Generar una URL de placeholder basada en el título

	return (
		<View style={ styles.place }>
			<View style={ styles.header }>
				<Image
					source={{ uri: img }} // Usar la imagen de la API
					style={ styles.image }
					onError={(e) => {
						console.log("Error cargando imagen para:", title, "URL:", img);
					}}
				/>
				<View style={ styles.placeInfo }>
					<Text style={ styles.title }>{ title }</Text>
					<Text style={ styles.location }>
						<Ionicons name="location-outline" /> { location }
					</Text>
					<View
						style={{
							flexDirection: "row",
							gap: 10,
						}}
					>
						<Text style={ styles.price }>
							<Ionicons name="logo-usd" /> { price }
						</Text>
						<Text style={ styles.availability }>{ availableSpots }/{ totalSpots } Disponibles</Text>
					</View>
					{/*  */}
					<View
						style={{
							flexDirection: "row",
							gap: 10,
						}}
					>
						<Text style={ styles.price }>
							<Ionicons name="time-outline" /> { schedule }
						</Text>
					</View>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					marginTop: 20,
					gap: 5,
				}}
			>
				<TouchableOpacity
					style={{ ...styles.button, flex: 1, }}
				>
					<Ionicons style={{ ...styles.buttonText, fontSize: 17, marginRight: 5 }} name="create-outline" />
					<Text style={ styles.buttonText }>
						Gestionar Espacios
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={ () => router.push(`/commerce/reports/placeStats?id=${ id }`) }
					style={{ ...styles.button, flex: 1, }}
				>
					<Ionicons style={{ ...styles.buttonText, fontSize: 17, marginRight: 5 }} name="stats-chart-outline" />
					<Text style={ styles.buttonText }>
						Estadisticas
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	place: {
		marginVertical: 10,
		backgroundColor: "#f5f5f5",
		padding: 15,
		borderRadius: 10
	},
	header: {
		flexDirection: "row"
	},
	image: {
		maxHeight: 100,
		maxWidth: "40%",
		borderRadius: 10,
		backgroundColor: "#e0e0e0", // Color de fondo mientras carga
	},
	placeInfo: {
		marginHorizontal: 10,
		gap: 7,
		flex: 1,
	},
	title: {
		fontWeight: "bold",
		fontSize: 15,
	},
	location: {
		color: "gray",
		fontSize: 13,
	},
	price: {
		color: "gray",
		fontSize: 13,
	},
	availability: {
		color: "gray",
		fontSize: 13,
	},
	button: {
		backgroundColor: "lightgray",
		paddingVertical: 7,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	buttonText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 13,
	},
});