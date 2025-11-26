import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import { RowConfigurationProps } from "@/types/component";

import { initAt, concatAt, deleteAt } from "@/utils/arrayUtils";

const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function RowConfiguration({
	rowIndex,
	rows,
	setRows
}: RowConfigurationProps) {
	const [nSpots, setNSpots] = useState<number>(0);

	useEffect(() => setNSpots( rows[rowIndex].length ), [rows]);

	return (
		<View style={ styles.rowConfig }>
			<Text
				style={{
					padding: 10,
					backgroundColor: "lightgray",
					color: "gray",
					borderRadius: 10,
					alignSelf: "flex-start",
				}}
			>
				{ ABC[rowIndex] }
			</Text>
			<Text>{ nSpots } { nSpots > 1 ? "espacios" : "espacio" }</Text>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 10, }}>
				<Pressable
					onPress={ () => nSpots > 1 && setRows( initAt( rows.map((row: string) => [...row]), rowIndex ).map((row: string[]) => row.join("")) ) }
				>
					<Ionicons
						size={ 30 }
						style={ styles.spotNumberControl }
						name="remove-outline"
					/>
				</Pressable>
				<Text style={{ fontWeight: "bold" }}>{ nSpots }</Text>
				<Pressable
					onPress={ () => setRows( concatAt( rows.map((row: string) => [...row]), "1", rowIndex ).map((row: string[]) => row.join("")) ) }
				>
					<Ionicons
						size={ 30 }
						style={ styles.spotNumberControl }
						name="add-outline"
					/>
				</Pressable>
			</View>
			<Pressable
				onPress={ () => setRows( deleteAt( rows, rowIndex ) )}
			>
				<Ionicons
					size={ 30 }
					style={{ ...styles.spotNumberControl, color: "red" }}
					name="close-outline"
				/>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	rowConfig: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		justifyContent: "space-between",
	},
	spotNumberControl: {
		padding: 2,
		borderRadius: 100,
		color: "#000",
		backgroundColor: "lightgray",
		fontWeight: "heavy"
	}
});