import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useState } from "react";
import ArrayUtils from "@/utils/ArrayUtils";

import { RowProps, SpotGridProps, SpotSquareProps } from "@/types/component";

const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type coord = { x: number; y: number };

export default function SpotsGrid({ spots, nColumns }: SpotGridProps) {
	const rows = ArrayUtils.splitN( [ ...spots ] , nColumns );
	const [selected, setSelected] = useState<coord | null>(null);

	return (
		<View style={ styles.grid }>
			{
				rows.map((columns, idx) => (
					<Row
						key={ idx }
						columns={ columns }
						rowIdx={ idx }
						selected={ selected }
						setSelected={ setSelected }
					/>
				))
			}
			{
				selected && (
					<>
						<View style={ styles.selectedSpot }>
							<Text style={{ fontSize: 10, }}>Parqueo Seleccionado</Text>
							<Text style={ styles.selectedSpotLabel } >{ ABC[ selected.y ] }{ selected.x + 1 }</Text>
						</View>
						<TouchableOpacity
							onPress={ () => {} }
							style={ styles.button }
						>
							<Text style={ styles.buttonText }>Continuar</Text>
						</TouchableOpacity>
					</>
				)
			}
		</View>
	);
}

function Row({ columns, rowIdx, selected, setSelected }: RowProps) {
	return (
		<View style={ styles.row }>
			<View style={{ ...styles.spotSquare, backgroundColor: "lightgray" }}>
				<Text style={{ ...styles.spotIndex, color: "gray" }}>{ ABC[ rowIdx ] }</Text>
			</View>
			{
				columns.map( (bit, idx) => (
					<Spot
						key={ idx }
						bit={ parseInt(bit) as 1 | 0 }
						x={ idx }
						y={ rowIdx }
						selected={ selected }
						setSelected={ setSelected }
					/>
				))
			}
		</View>
	);
}

function Spot({ bit, x, y, selected, setSelected }: SpotSquareProps) {
	let backgroundColor = bit == 1 ? "#16A249" : "#ef4444";
	if (selected && selected.x == x && selected.y == y) backgroundColor = "#275C9C";

	return (
		<Pressable
			onPress={ () => bit && setSelected({ x: x, y: y }) }
			style={{
				...styles.spotSquare,
				backgroundColor: backgroundColor,
			}}>
			<Text style={ styles.spotIndex }>{ x + 1 }</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	grid: {
		flex: 1,
		width: "100%",
		padding: 10,
	},
	row: {
		flexDirection: "row",
		gap: 3,
		marginBottom: 15,
	},
	spotSquare: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 5,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
	},
	spotIndex: {
		color: "white",
		fontWeight: "normal",
	},
	selectedSpotLabel: {
		fontWeight: "bold",
		color: "#275C9C",
		fontSize: 20,
	},
	selectedSpot: {
		borderColor: "#275C9C",
		borderRadius: 10,
		borderWidth: 1,
		backgroundColor: "#88CFE7",
		alignItems: "center",
		paddingVertical: 10,
		marginHorizontal: 25,
		marginVertical: 15,
	},
	button: {
		alignSelf: "center",
		backgroundColor: "#275C9C",
		paddingVertical: 5,
		paddingHorizontal: 15,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
	}
});
