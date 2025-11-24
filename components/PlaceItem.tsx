import { Pressable, View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PlaceItemProps } from "@/types/component";

import PlaceImage from "@/assets/images/commerce.png";

import Configuration from "@/config/constants";

export default function PlaceItem({
	id,
	title,
	location,
	price,
	availableSpots,
	totalSpots
}: PlaceItemProps) {
	return (
		<View style={ styles.place }>
			<View style={ styles.header }>
				<Image
					source={ PlaceImage }
					style={ styles.image }
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
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					marginTop: 20,
				}}
			>
				<TouchableOpacity
					style={{ ...styles.button, flex: 1, }}
				>
					<Text style={ styles.buttonText }>Gestionar Espacios</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={ styles.button }
				>
					<Ionicons style={ styles.buttonText } name="trash-outline" size={ 20 } />
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
		maxWidth: "50%",
	},
	placeInfo: {
		marginHorizontal: 10,
		gap: 7,
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
		backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
		paddingVertical: 7,
		paddingHorizontal: 20,
		borderRadius: 10,
		marginHorizontal: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 15,
	},
});