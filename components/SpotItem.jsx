import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import SpotImage from "@/assets/images/333.jpg"
import { Ionicons } from "@expo/vector-icons";

const SpotItem = ({ title, location, freeSpots, distance, stars, price, image }) => {
	const { width, height } = useWindowDimensions();
	return (
		<View style={ { ...styles.spotItem, width: width * 0.8 } }>
			<View style={ { ...styles.spotHeader, height: height * 0.15 } }>
				<Image source={ SpotImage } style={ { ...styles.spotImage, maxHeight: height * 0.15 } } />
				<Text style={ styles.spotPrice }>L.{ price }/hr</Text>
				<Ionicons
					name="heart-outline"
					size={25}
					color="white"
					style={{
						position: "absolute",
						left: 10,
						top: 10,
					}}
				/>
			</View>
			<View
				style={{
					flexDirection: "row",
					paddingHorizontal: 10,
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 7,
				}}
			>
				<Text style={ styles.spotTitle }>{ title.length > 15 ? title.substring(0, 15) + "..." : title }</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Ionicons name="star" size={13} color="#275C9C" />
					<Text style={ styles.spotStars }>{ stars }</Text>
				</View>
			</View>
			<View
				style={{
					paddingHorizontal: 10,
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 7,
				}}
			>
				<Ionicons name="location-outline" size={13} color="gray" />
				<Text style={ styles.spotLocation }>{ location } </Text>
				<Ionicons name="ellipse" size={5} color="gray" />
				<Text style={ styles.spotDistance }> { distance } km</Text>
			</View>
			<View
				style={{
					paddingHorizontal: 10,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 15,
				}}
			>
				<Text style={ styles.spotFreeSpots }>{ freeSpots } espacios disponibles</Text>
				<TouchableOpacity
					style={ styles.button }
					onPress={() => router.push("/") }
				>
					<Text style={ styles.buttonText }>Reservar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	spotItem: {
		/* flexDirection: "row",*/
		justifyContent: "space-between",
		backgroundColor: "#f5f5f5",
		borderRadius: 5,
		borderRadius: 5,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	spotHeader: {
		height: 100,
		marginBottom: 10,
	},
	spotImage: {
		width: "100%",
		maxHeight: 50,
		marginBottom: 20,
		// borderRadius: 10,
	},
	spotPrice: {
		position: "absolute",
		right: 10,
		top: 10,
		backgroundColor: "white",
		paddingHorizontal: 5,
		paddingVertical: 3,
		borderRadius: 5,
		fontWeight: "bold",
		fontSize: 12,
	},
	spotTitle: {
		fontWeight: "bold",
		fontSize: 17,
	},
	spotStars: {
		fontSize: 13,
		fontWeight: "bold",
		marginLeft: 7,
	},
	spotLocation: {
		color: "gray",
		fontSize: 13,
	},
	spotDistance: {
		color: "gray",
		fontSize: 13,
	},
	spotFreeSpots: {
		color: "gray",
		fontSize: 13,
	},
	button: {
		backgroundColor: "#275C9C",
		paddingVertical: 5,
		paddingHorizontal: 8,
		borderRadius: 5,
	},
	buttonText: {
		color: "white",
		fontSize: 13,
		fontWeight: "bold",
	},
});

export default SpotItem;
