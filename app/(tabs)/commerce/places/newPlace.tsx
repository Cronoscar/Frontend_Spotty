import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-native-root-toast";
import SpotsGrid from "@/components/SpotsGrid";
import RowConfiguration from "@/components/RowConfiguration";

import Configuration from "@/config/constants";

export default function() {
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [price, setPrice] = useState("");

	const [spots, setSpots] = useState(0);
	const [rows, setRows] = useState<string[]>([]);

	const router = useRouter();

	useEffect(() => {
		setSpots(rows.reduce((acc, row) => acc + row.length, 0));
	}, [rows]);

	// ---------------------------------------------------
	// 1️⃣ CREAR SUCURSAL
	// ---------------------------------------------------
	async function createBranch() {
		const local = localStorage.getItem('session');
		const data= JSON.parse(local || '{}');
		try {
			const body = {
				nameBranch: name,
				location: location,
				availableSpots: spots,
				hourlyPrice: Number(price),
				totalSpots: spots,
				parkingTimeLimit: 24,
				commerceID: data.userData.commerce.ID_Comercio
			};

			const res = await axios.post(
				`${Configuration.API_BASE_URL}/api/branches`,
				body
			);

			if (!res.data.success) {
				Alert.alert("Error", "No se pudo crear la sucursal.");
				return null;
			}

			return res.data.data;

		} catch (error) {
			console.log("ERROR creando sucursal:", error);
			Alert.alert("Error", "No se pudo crear la sucursal (backend).");
			return null;
		}
	}

	// ---------------------------------------------------
	// 2️⃣ CREAR ESPACIOS DE PARQUEO
	// ---------------------------------------------------
	async function createParkingSpots(branchId: number) {
		try {
			let requests: any[] = [];
			let rowLetter = "A".charCodeAt(0);

			rows.forEach((row, rowIndex) => {
				const letter = String.fromCharCode(rowLetter + rowIndex);

				for (let i = 0; i < row.length; i++) {
					const spotCode = `${letter}-${i + 1}`;

					const body = {
						codigo: spotCode,
						disponible: true,
						id_sucursal: branchId
					};

					requests.push(
						axios.post(`${Configuration.API_BASE_URL}/api/parkingspots`, body)
					);
				}
			});

			await Promise.all(requests);
			return true;

		} catch (error) {
			console.log("ERROR creando espacios:", error);
			Alert.alert("Error", "No se pudieron crear los espacios.");
			return false;
		}
	}

async function handleCreateAll() {
    if (!name || !location || !price || rows.length === 0) {
        Alert.alert("Campos faltantes", "Completa todos los campos antes de continuar.");
        return;
    }

    // 1) Crear sucursal
    const branch = await createBranch();
    if (!branch) return;

    // 2) Obtener ID real de sucursal
    const branchId =
        branch.id_sucursal ||
        branch.idSucursal ||
        branch.id ||
        null;

    if (!branchId) {
        Alert.alert(
            "Error",
            "El backend no retornó el ID de la sucursal. Asegúrate de devolverlo con SCOPE_IDENTITY()."
        );
        return;
    }

    // 3) Crear espacios
    const ok = await createParkingSpots(branchId);
    if (!ok) return;

    // 4) Mostrar Toast (react-native-root-toast)
    toast.show("Sucursal creada exitosamente", {
        duration: toast.durations.SHORT,
    });

    // 5) Redirigir
    setTimeout(() => {
       router.replace("/commerce/places");
    }, 1000);
}


	// ---------------------------------------------------
	// RENDER
	// ---------------------------------------------------
	return (
		<SafeAreaView style={ styles.safeArea }>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
				<TouchableOpacity onPress={ () => router.back() }>
					<Ionicons style={ styles.backButton } name="arrow-back-outline" size={ 20 } />
				</TouchableOpacity>
				<Text style={ styles.title }>Agregar Establecimiento</Text>
			</View>

			<ScrollView style={{ flex: 1 }}>
				<View style={ styles.container }>

					<Text>Nombre del establecimiento</Text>
					<TextInput style={ styles.input } value={ name } onChangeText={ setName } placeholder="Ej: Comercio 1" />

					<Text>Dirección</Text>
					<TextInput style={ styles.input } value={ location } onChangeText={ setLocation } placeholder="Ej. Plaza 1" />

					<Text>Precio por Hora ($)</Text>
					<TextInput style={ styles.input } value={ price } onChangeText={ setPrice } placeholder="Ej 10" />

					<Text>Imagen</Text>
					<Pressable style={ styles.uploadImage }>
						<Ionicons name="cloud-upload-outline" size={ 35 } />
					</Pressable>

					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<View>
							<Text>Diseño del Estacionamiento</Text>
							<Text style={{ fontSize: 12 }}>Total: { spots } espacios</Text>
						</View>

						<TouchableOpacity
							onPress={() => setRows(prev => prev.concat(["1"]))}
							style={ styles.button }
						>
							<Text style={ styles.buttonText }>+ Agregar fila</Text>
						</TouchableOpacity>
					</View>

					<SpotsGrid rows={ rows } />

					{rows.length > 0 && (
						<View style={ styles.placeRows }>
							<Text style={{ alignSelf: "center", fontSize: 17, marginBottom: 10 }}>
								Agregar Espacios
							</Text>

							{rows.map((row, idx) => (
								<RowConfiguration key={ idx } rowIndex={ idx } rows={ rows } setRows={ setRows } />
							))}

							<TouchableOpacity
								onPress={ handleCreateAll }
								style={{ ...styles.button, alignSelf: "center", marginTop: 15 }}
							>
								<Text style={ styles.buttonText }>Agregar Establecimiento</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

// ---------------------------------------------------
// ESTILOS
// ---------------------------------------------------
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
	input: {
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
		paddingVertical: 7,
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
	placeRows: {},
});
