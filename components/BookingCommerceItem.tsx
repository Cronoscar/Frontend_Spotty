import { Pressable, View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { BookingCommerceItemProps } from "@/types/booking";

import PlaceImage from "@/assets/images/spot.png";
import Configuration from "@/config/constants";

export default function BookingCommerceItem({
	id,
	title,
	location,
	nBookings,
	availableSpots,
	totalSpots,
	bookings,
	img
}: BookingCommerceItemProps) {
	const router = useRouter();

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
						<Text
							style={{
								...styles.availability,
								backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
								color: Configuration.SPOTTY_PRIMARY_COLOR,
							}}>
								{ nBookings } reservados
							</Text>
						<Text style={ styles.availability }>{ Math.floor(availableSpots / totalSpots * 100) }% Ocupacion</Text>
					</View>
					{/*  */}
					<View
						style={{
							flexDirection: "row",
							gap: 10,
						}}
					>
					</View>
				</View>
			</View>
			<View style={{ borderBottomColor: "lightgray", borderBottomWidth: 1, marginVertical: 10 }}></View>
			<View style={ styles.booked }>
				{
					(!bookings || bookings.length === 0)
						? <NoBookings />
						: (
							<></>
						)
				}
			</View>
			<View style={{ borderBottomColor: "lightgray", borderBottomWidth: 1, marginVertical: 10 }}></View>
			<View style={{
				flexDirection: "row",
				justifyContent: "space-between",
				paddingHorizontal: 10,
			}}>
				<View style={ styles.bookingInfo }>
					<Text>Total</Text>
					<Text style={ styles.bookingInfoValue }>{ totalSpots }</Text>
				</View>
				<View style={ styles.bookingInfo }>
					<Text>Reservados</Text>
					<Text style={{ ...styles.bookingInfoValue, color: Configuration.SPOTTY_PRIMARY_COLOR }}>{ bookings }</Text>
				</View>
				<View style={ styles.bookingInfo }>
					<Text>Disponibles</Text>
					<Text style={{ ...styles.bookingInfoValue, color: "green" }}>{ availableSpots }</Text>
				</View>
			</View>
		</View>
	);
}

function NoBookings() {
	return (
		<View style={ noBookingsStyles.container }>
			<Ionicons name="car-outline" style={ noBookingsStyles.icon } />
			<Text style={ noBookingsStyles.message }>No hay espacios reservados en este momento.</Text>
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
		fontSize: 10,
		paddingVertical: 3,
		paddingHorizontal: 10,
		borderRadius: 10,
		fontWeight: "bold",
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
	booked: {
		height: 150,
		paddingVertical: 25,
	},
	bookingInfo: {
		alignItems: "center",
		justifyContent: "center"
	},
	bookingInfoValue: {
		fontSize: 15,
		fontWeight: "bold"
	},
});

const noBookingsStyles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		gap: 10,
	},
	icon: {
		borderRadius: 100,
		padding: 10,
		backgroundColor: "lightgray",
		fontSize: 20,
	},
	message: {
		fontSize: 13,
		color: "gray",
	}
});