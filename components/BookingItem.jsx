import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BookingItem = ({ title, state, location, date, time, price }) => {
	const { width, height } = useWindowDimensions();
	return (
		<View style={ styles.container }>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Text style={ styles.title }>{ title.length > 15 ? title.substring(0,15) + "..." : title }</Text>
				<View style={ styles.state }>
					<Text style={{ color: "#fff" }}>{ state }</Text>
				</View>
			</View>
			<View style={ styles.location }>
				<Ionicons name="location-outline" size={13} color="gray" />
				<Text style={ styles.detailsText }> { location }</Text>
			</View>
			<View style={ styles.datetime }>
				<Ionicons name="calendar-outline" size={13} color="gray" />
				<Text style={ styles.detailsText }> { date }  </Text>
				<Ionicons name="time-outline" size={13} color="gray" />
				<Text style={ styles.detailsText }> { time }</Text>
			</View>
			{/* HR */}
			<View style={{ borderBottomColor: "lightgray", borderBottomWidth: 1, marginVertical: 10 }}></View>
			<View style={ styles.price }>
				<Text style={ styles.priceText }>L.{ price }</Text>
				<TouchableOpacity
					onPress={ () => {} }
					style={ styles.detailsButton }
				>
					<Text>Ver detalles</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f5f5f5",
		borderColor: "lightgray",
		borderRadius: 10,
		borderWidth: 1,
		paddingTop: 10,
		paddingBottom: 15,
		paddingHorizontal: 10,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	title: {
		fontWeight: "bold",
		fontSize: 17,
	},
	state: {
		backgroundColor: "#275C9C",
		borderRadius: 10,
		paddingVertical: 3,
		paddingHorizontal: 5,
		width: 100,
		alignItems: "center",
	},
	location: {
		flexDirection: "row",
		alignItems: "center",
	},
	detailsText: {
		color: "gray",
		fontSize: 13,
	},
	datetime: {
		flexDirection: "row",
		alignItems: "center",
	},
	price: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	priceText: {
		fontWeight: "bold",
		fontSize: 20,
	},
	detailsButton: {
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 5,
		paddingHorizontal: 7,
	}
});

export default BookingItem;
