import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Place } from "@/types/place";

import Configuration from "@/config/constants";
import PlaceStatList from "@/components/PlaceStatList";

const examplePlaces: Place[] = [
	{
		id: 1,
		title: "Casa de Playa El Paraíso",
		location: "Tela, Honduras",
		price: "150.00",
		availableSpots: 3,
		totalSpots: 6,
		schedule: "08:00 AM - 01:30 PM",
	},
	{
		id: 2,
		title: "Cabaña en el Lago",
		location: "Lago de Yojoa, Honduras",
		price: "95.00",
		availableSpots: 1,
		totalSpots: 4,
		schedule: "08:00 AM - 01:30 PM",
	},
	{
		id: 3,
		title: "Apartamento Moderno",
		location: "San Pedro Sula, Honduras",
		price: "80.00",
		availableSpots: 2,
		totalSpots: 2,
		schedule: "08:00 AM - 01:30 PM",
	},
	{
		id: 4,
		title: "Glamping Montaña Azul",
		location: "La Esperanza, Honduras",
		price: "110.00",
		availableSpots: 5,
		totalSpots: 8,
		schedule: "08:00 AM - 01:30 PM",
	},
	{
		id: 5,
		title: "Hostal Colonial",
		location: "Comayagua, Honduras",
		price: "35.00",
		availableSpots: 10,
		totalSpots: 12,
		schedule: "08:00 AM - 01:30 PM",
	},
];

export default function() {
	const [searchBox, setSearchBox] = useState<string>("");
	const [places, setPlaces] = useState<Place[]>([]);

	useEffect(() => {
		setPlaces(examplePlaces);
	}, []);

	return(
		<SafeAreaView style={ styles.safeArea }>
			<View style={ styles.search }>
				<TextInput
					style={ styles.input }
					placeholder="Buscar establecimiento"
					placeholderTextColor="gray"
					value={ searchBox }
					onChangeText={ setSearchBox }
				/>
				<Ionicons name="search" size={ 20 } color="#999" />
			</View>
			{/*  */}
			<View style={ styles.stats }>
				{/*  */}
				<View style={ styles.statsRow }>
					{/*  */}
					<View style={ styles.statItem }>
						<View style={ styles.statHeader }>
							<Ionicons name="bar-chart-outline" />
							<Text style={ styles.statTitle }>Reservas</Text>
						</View>
						<Text style={ styles.statValue }>{ 198 }</Text>
					</View>
					{/*  */}
					<View style={ styles.statItem }>
						<View style={ styles.statHeader }>
							<Ionicons name="logo-usd" />
							<Text style={ styles.statTitle }>Ingresos</Text>
						</View>
						<Text style={ styles.statValue }>${ 198 }</Text>
					</View>
				</View>
				{/*  */}
				<View style={ styles.statsRow }>
					<View style={ styles.statItem }>
						<View style={ styles.statHeader }>
							<Ionicons name="star-outline" color={ Configuration.SPOTTY_SECONDARY_COLOR } />
							<Text style={ styles.statTitle }>Valoracion</Text>
						</View>
						<View style={{ flexDirection: "row", alignItems: "center", gap: 5, }}>
							<Text style={ styles.statValue }>{ 4.7 }</Text>
							<Ionicons name="star" size={ 15 } color={ Configuration.SPOTTY_SECONDARY_COLOR } />
						</View>
					</View>
					{/*  */}
					<View style={ styles.statItem }>
						<View style={ styles.statHeader }>
							<Ionicons name="location-outline" color={ Configuration.SPOTTY_SECONDARY_COLOR } />
							<Text style={ styles.statTitle }>Espacios</Text>
						</View>
						<Text style={ styles.statValue }>{ 41 }</Text>
					</View>
				</View>
			</View>
			{/*  */}
			<View style={ styles.places }>
				<PlaceStatList places={ places } />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	search: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 10,
		marginHorizontal: 10,
		backgroundColor: "lightgray",
		borderRadius: 20,
		paddingHorizontal: 15,
	},
	input: {
		flex: 2,
		paddingVertical: 10,
	},
	stats: {
		gap: 10,
		marginTop: 15,
	},
	statsRow: {
		flexDirection: "row",
		gap: 10,
	},
	statValue: {
		fontWeight: "bold",
		fontSize: 20,
	},
	statTitle: {
	},
	statHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	statItem: {
		flex: 1,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	places: {
		flex: 1,
		marginTop: 10,
	},
});