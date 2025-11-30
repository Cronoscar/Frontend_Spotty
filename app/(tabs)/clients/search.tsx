import { View, TextInput, StyleSheet, ActivityIndicator, } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import SpotList from "@/components/SpotList";
import SearchFilters from "@/components/SearchFilters";

import { Spot } from "@/types/spot";

import Configuration from "@/config/constants";

import SpotImage from "@/assets/images/location.png";
import SpotImage1 from "@/assets/images/commerce.png";
import SpotImage0 from "@/assets/images/spot0.png";

const exampleSpots: Spot[] = [
	{
		id: 1,
		title: "Mall Multiplaza (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2, // km
		stars: 4.7,
		price: 35,
		image: SpotImage,
	},
	{
		id: 2,
		title: "Mall Premiere (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2, // km
		stars: 4.7,
		price: 35,
		image: SpotImage1,
	},
	{
		id: 3,
		title: "Mall Multiplaza (Tegucigalpa)",
		location: "Blv. Suyapa",
		freeSpots: 10,
		distance: 1.2, // km
		stars: 4.7,
		price: 35,
		image: SpotImage0,
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
];

export default function() {
	const [loading, setLoading] = useState<boolean>(false);
	const [searchBox, setSearchBox] = useState<string>("");
	const [spots, setSpots] = useState<Spot[]>([]);

	const [filters, setFilters] = useState<Record<number, string>>({});

	useEffect(function() {
		setTimeout(function() {
			setLoading(false);
		}, 3000);
	}, [spots]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const appliedFilters = Object.keys(filters).length != 0;

			if (!searchBox && appliedFilters) {

			}

			if (!searchBox && !appliedFilters) {
				setSpots([]);
				return;
			}

			setLoading(true);
			setSpots(exampleSpots.filter(spot => new RegExp(`.*${searchBox}.*`, "i").test(spot.title)));
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchBox, filters]);

	return (
		<SafeAreaView style={ styles.safeArea }>
			<View style={ styles.container }>
				<TextInput
					style={styles.input}
					placeholder="Buscar establecimiento"
					placeholderTextColor="gray"
					value={searchBox}
					onChangeText={setSearchBox}
				/>
				<Ionicons name="search" size={ 20 } color="#999" />
			</View>
			{/*  */}
			<SearchFilters
				filters={ filters }
				setFilters={ setFilters }
			/>
			{/*  */}
			<View style={ styles.spots }>
				{
					loading
						? <ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
						: <SpotList spots={ spots }/>
				}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		alignItems: "center",
	},
	container: {
		width: "85%",
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 10,
		backgroundColor: "lightgray",
		borderRadius: 20,
		paddingHorizontal: 15,
	},
	input: {
		flex: 2,
		paddingVertical: 10,
	},
	spots: {
		flex: 1,
		height: "90%",
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center",
	},
});
