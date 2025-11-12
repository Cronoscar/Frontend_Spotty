import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentMethod({ title, expirationDate, isDefault }) {
	return (
		<View style={ styles.container }>
			<Ionicons style={ styles.card } name="card-outline" size={ 35 } />
			<View>
				<Text>{ title }</Text>
				<Text style={ styles.expirationDate }>Vence { expirationDate }</Text>
			</View>
			{ isDefault && <Text style={ styles.def }>Por Defecto</Text> }
			<Ionicons style={ styles.trash } name="trash-outline" size={ 25 } />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginBottom: 10,
	},
	card: {
		borderRadius: 100,
		padding: 3,
		backgroundColor: "#88CFE7",
		marginRight: 10,
		color: "#275C9C",
	},
	expirationDate: {
		color: "gray",
		fontSize: 10,
	},
	trash: {
		color: "red",
		marginLeft: "auto",
	},
	def: {
		borderRadius: 20,
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: "#88CFE7",
		color: "#275C9C",
		fontSize: 9,
		fontWeight: "thin",
		marginLeft: 10,
	}
});
