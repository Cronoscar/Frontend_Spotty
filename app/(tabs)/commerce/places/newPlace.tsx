import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import SpotsGrid from "@/components/SpotsGrid";
import RowConfiguration from "@/components/RowConfiguration";

import Configuration from "@/config/constants";

export default function() {
	const [name, setName] = useState<string>("");
	const [location, setLocation] = useState<string>("");
	const [price, setPrice] = useState<string>("");

	const [spots, setSpots] = useState<number>(0);
	const [rows, setRows] = useState<string[]>([]);

	const router = useRouter();

	useEffect(() => setSpots( rows.reduce( (acc: number, row: string) => acc + row.length , 0 ) ), [rows]);

	return (
		<SafeAreaView style={ styles.safeArea }>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
					marginBottom: 10,
				}}
			>
				<TouchableOpacity
					onPress={ () => router.back() }
				>
					<Ionicons
						style={ styles.backButton }
						name="arrow-back-outline"
						size={ 20 }
					/>
				</TouchableOpacity>
				<Text style={ styles.title }>Agregar Establecimiento</Text>
			</View>
			<ScrollView style={{ flex: 1, }}>
				<View style={ styles.container }>
					<Text>Nombre del establecimiento</Text>
					<TextInput
						style={ styles.input }
						value={ name }
						onChangeText={ setName }
						placeholder="Ej: Comercio 1"
						maxLength={ 15 }
					/>
					<Text>Dirección</Text>
					<TextInput
						style={ styles.input }
						value={ location }
						onChangeText={ setLocation }
						placeholder="Ej. Plaza 1"
						maxLength={ 15 }
					/>
					<Text>Precio por Hora ($)</Text>
					<TextInput
						style={ styles.input }
						value={ price }
						onChangeText={ setPrice }
						placeholder="Ej 10"
						maxLength={ 5 }
					/>
					<Text>Imagen</Text>
					<Pressable
						style={ styles.uploadImage }
					>
						<Ionicons name="cloud-upload-outline" size={ 35 } />
					</Pressable>
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<View>
							<Text>Diseño del Estacionamiento</Text>
							<Text style={{ fontSize: 12 }}>Total: { spots } espacios</Text>
						</View>
						<TouchableOpacity
							onPress={ function() {
								setRows(function(rows) {
									return rows.concat(["1"]);
								})}}
							style={ styles.button }
						>
							<Text style={ styles.buttonText }>+ Agregar fila</Text>
						</TouchableOpacity>
					</View>
					<View
						style={{
							height: 45,
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<Text
							style={{
								alignSelf: "center",
								fontSize: 20,
								fontWeight: "bold",
							}}
						>
							{ name }
						</Text>
					</View>
					{/*  */}
					<SpotsGrid rows={ rows } />
					{/*  */}
					{
						rows.length > 0 && (
							<View style={ styles.placeRows }>
								<View>
									<Text
										style={{
											alignSelf: "center",
											fontSize: 17,
											marginBottom: 10,
										}}
									>
										Agregar Espacios
									</Text>
								</View>
								{
									rows.map(function(row: string, idx: number) {
										return (
											<RowConfiguration
												key={ idx }
												rowIndex={ idx }
												rows={ rows }
												setRows={ setRows }
											/>
										);
									})
								}
								<TouchableOpacity
									onPress={ () => {} }
									style={{ ...styles.button, alignSelf: "center", marginTop: 15 }}
								>
									<Text style={ styles.buttonText }>Agregar Establecimiento</Text>
								</TouchableOpacity>
							</View>
						)
					}
				</View>
			</ScrollView>
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
	container: {
		padding: 15,
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		marginTop: 10,
	},
	backButton: {
		backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
		color: Configuration.SPOTTY_PRIMARY_COLOR,
		borderRadius: 100,
		padding: 10,
	},
	title: {
		fontWeight: "bold",
		fontSize: 20,
	},
	subtitle: {
		fontSize: 15,
		color: "lightgray",
		marginVertical: 10,
		marginHorizontal: 15,
	},
	input: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 10,
		marginTop: 5,
		marginBottom: 10,
	},
	uploadImage: {
		backgroundColor: "lightgray",
		alignItems: "center",
		borderRadius: 10,
		paddingVertical: 5,
		marginTop: 5,
		marginBottom: 10,
	},
	button: {
		backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
		paddingVertical: 5,
		paddingHorizontal: 15,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 14,
	},
	placeRows: {

	},
});