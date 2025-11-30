import { Text, StyleSheet, View, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import PlaceList from "@/components/PlaceList";

import { useAuthStatus } from "@/hooks/useAuthStatus";

import { useAuth } from "@/contexts/AuthContext";

import Configuration from "@/config/constants";

import { Place } from "@/types/place";

const examplePlaces0: Place[] = [];

const examplePlaces: Place[] = [
	{
		id: 1,
		title: "Casa de Playa El Paraíso",
		location: "Tela, Honduras",
		price: "150.00",
		availableSpots: 3,
		totalSpots: 6,
		schedule: "",
	},
	{
		id: 2,
		title: "Cabaña en el Lago",
		location: "Lago de Yojoa, Honduras",
		price: "95.00",
		availableSpots: 1,
		totalSpots: 4,
		schedule: "",
	},
	{
		id: 3,
		title: "Apartamento Moderno",
		location: "San Pedro Sula, Honduras",
		price: "80.00",
		availableSpots: 2,
		totalSpots: 2,
		schedule: "",
	},
	{
		id: 4,
		title: "Glamping Montaña Azul",
		location: "La Esperanza, Honduras",
		price: "110.00",
		availableSpots: 5,
		totalSpots: 8,
		schedule: "",
	},
	{
		id: 5,
		title: "Hostal Colonial",
		location: "Comayagua, Honduras",
		price: "35.00",
		availableSpots: 10,
		totalSpots: 12,
		schedule: "",
	},
];

export default function() {
	const [loading, setLoading] = useState<boolean>(true);
	const [places, setPlaces] = useState<Place[]>([]);
	const [searchBox, setSearchBox] = useState<string>("");

	const { session } = useAuth();
	
	const router = useRouter();

	useAuthStatus(async function() {
		setPlaces(examplePlaces);
		setLoading(false);
	});

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					marginVertical: 15,
				}}
			>
				<ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<View style={ styles.header }>
				<View>
					<Text style={ styles.title }>Mis Establecimientos</Text>
					<Text style={ styles.subtitle }>Gestiona tus espacios de parqueo</Text>
				</View>
				<TouchableOpacity
					onPress={ function() { router.push("/commerce/places/newPlace") } }
					style={ styles.addButton }
				>
					<Text style={ styles.buttonText }>+ Agregar</Text>
				</TouchableOpacity>
			</View>
			{
				places.length === 0
					? <NoPlaces />
					: (
						<>
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
							<PlaceList places={ places } />
						</>
					)
			}
		</SafeAreaView>
	);
}

function NoPlaces() {
	const router = useRouter();

	return (
		<View
			style={{
				borderRadius: 10,
				backgroundColor: "#f5f5f5",
				padding: 20,
				margin: 20,
				alignItems: "center",
				gap: 10,
				marginVertical: "auto",
			}}
		>
			<Ionicons
				name="location-outline"
				size={ 100 }
				style={{
					color: "#fff",
					borderRadius: 100,
					backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
					padding: 20,
					margin: 10,
				}}
			/>
			<Text
				style={{
					fontWeight: "bold",
					fontSize: 25,
				}}
			>
				No hay establecimientos
			</Text>
			<Text
				style={{
					color: "gray",
					fontSize: 14,
					marginBottom: 15,
				}}
			>
				Comienza agregando tu primer establecimiento
			</Text>
			<TouchableOpacity
				onPress={ function() { router.push("/commerce/places/newPlace") } }
				style={ styles.addButton }
			>
				<Text style={ styles.buttonText }>+ Agregar Establecimiento</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		width: "100%",
		flexDirection: "row",
		marginTop: 10,
		marginHorizontal: 15,
		alignItems: "center",
		alignSelf: "center",
		justifyContent: "space-between",
		paddingHorizontal: 15,
	},
	title: {
		fontWeight: "bold",
		fontSize: 20,
	},
	subtitle: {
		fontSize: 15,
		color: "gray",
		marginVertical: 5,
	},
	addButton: {
		backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
		paddingVertical: 7,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 14,
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
});