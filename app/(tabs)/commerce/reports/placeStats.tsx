import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { PlaceStats } from "@/types/placeStat";

import Configuration from "@/config/constants";

const exampleStats: PlaceStats = {
	id: 1,
	title: "Mega Mall",
	location: "Col. Las Brisas",
	totalBookings: 100,
	totalIncome: 2112331,
	avgRating: 4.8,
	availableSpots: 15,
	totalSpots: 25,
	schedule: "08:30 AM - 1:30 PM",
	price: 10,
};

export default function() {
	const [stats, setStats] = useState<PlaceStats | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();

	useEffect(function() {
		setStats(exampleStats);
		setLoading(false);
	}, []);

	if (loading || !stats) {
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
		<SafeAreaView style={ styles.safeArea }>
			<TouchableOpacity
				style={{ alignSelf: "flex-start", paddingBottom: 10, }}
				onPress={ () => router.back() }
			>
				<Ionicons
					style={ styles.backButton }
					name="arrow-back-outline"
					size={ 20 }
				/>
			</TouchableOpacity>
			<ScrollView contentContainerStyle={ styles.container }>
				<Text style={ styles.title }>{ stats.title }</Text>
				<View style={ styles.location }>
					<Ionicons name="location-outline" size={ 20 } />
					<Text>{ stats.location }</Text>
				</View>
				{/*  */}
				<View style={ statCardStyle.container }>
					<Ionicons name="bar-chart-outline" style={{ ...statCardStyle.icon, color: "gray", backgroundColor: "lightgray" }} />
					<Text>Total Reservas</Text>
					<Text style={ statCardStyle.statValue }>{ stats.totalBookings }</Text>
				</View>
				{/*  */}
				<View style={ statCardStyle.container }>
					<Ionicons name="logo-usd" style={{ ...statCardStyle.icon, color: "green", backgroundColor: "lightgreen" }} />
					<Text>Ingresos totales</Text>
					<Text style={ statCardStyle.statValue }>
						{ new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(stats.totalIncome) }
					</Text>
				</View>
				{/*  */}
				<View style={ statCardStyle.container }>
					<Ionicons name="star-outline" style={{ ...statCardStyle.icon, color: Configuration.SPOTTY_SECONDARY_COLOR, backgroundColor: "#fff" }} />
					<Text>Valoración promedio</Text>
					<View style={{ flexDirection: "row" }}>
						<Text style={{ ...statCardStyle.statValue, marginRight: 10, }}>
							{ stats.avgRating }
						</Text>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							{
								[...Array(Math.floor(stats.avgRating)).keys()]
									.map((_, idx) => (
										<Ionicons key={ idx } name="star" color={ Configuration.SPOTTY_SECONDARY_COLOR } size={ 20 } />
									))
							}
						</View>
					</View>
				</View>
				{/*  */}
				<View style={ statCardStyle.container }>
					<Ionicons name="location-outline" style={{ ...statCardStyle.icon, color: Configuration.SPOTTY_SECONDARY_COLOR, backgroundColor: "#fff" }} />
					<Text>Ocupación actual</Text>
					<Text style={ statCardStyle.statValue }>{ stats.totalSpots - stats.availableSpots }/{ stats.totalSpots }</Text>
				</View>
				{/*  */}
				<View style={ styles.placeConfig }>
					<Text style={{ fontWeight: "bold", fontSize: 20, }}>Configuración</Text>
					<View style={ styles.placeConfigItem }>
						<Text style={ styles.placeConfigItemText }>Precio por hora</Text>
						<Text style={ styles.placeConfigItemText }>{ new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(stats.price) }</Text>
					</View>
					<View style={ styles.placeConfigItem }>
						<Text style={ styles.placeConfigItemText }>Horario</Text>
						<View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
							<Ionicons name="time-outline" style={ styles.placeConfigItemText} />
							<Text style={ styles.placeConfigItemText }>{ stats.schedule }</Text>
						</View>
					</View>
					<View style={ styles.placeConfigItem }>
						<Text style={ styles.placeConfigItemText }>Total espacios</Text>
						<Text style={ styles.placeConfigItemText }>{ stats.totalSpots }</Text>
					</View>
				</View>
				{/* --- COBRAR INGRESOS --- */}
<View style={ withdrawStyles.container }>
    
    <View style={ withdrawStyles.header }>
        <Ionicons name="wallet-outline" size={26} color="#4CAF50" />
        <View>
            <Text style={ withdrawStyles.headerTitle }>Cobrar Ingresos</Text>
            <Text style={ withdrawStyles.headerSubtitle }>Retira tus ganancias a tu cuenta bancaria</Text>
        </View>
    </View>

    {/* Datos */}
    <View style={ withdrawStyles.row }>
        <Text style={ withdrawStyles.label }>Ingresos generados</Text>
        <Text style={ withdrawStyles.value }>
            { new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalIncome) }
        </Text>
    </View>

    <View style={ withdrawStyles.row }>
        <Text style={ withdrawStyles.label }>Comisión Spotty (5%)</Text>
        <Text style={ withdrawStyles.commission }>
            -{ new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalIncome * 0.05) }
        </Text>
    </View>

    {/* Monto final */}
    <Text style={ withdrawStyles.receiveLabel }>Monto a recibir</Text>
    <Text style={ withdrawStyles.receiveValue }>
        { new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalIncome * 0.95) }
    </Text>

    {/* Botón */}
    <TouchableOpacity style={ withdrawStyles.button }>
        <Ionicons name="card-outline" size={20} color="#fff" />
        <Text style={ withdrawStyles.buttonText }>
            Cobrar { new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalIncome * 0.95) }
        </Text>
    </TouchableOpacity>

    <View style={ withdrawStyles.footer }>
        <Ionicons name="checkmark-circle" size={18} color="green" />
        <Text style={ withdrawStyles.footerText }>Transferencia en 2–3 días hábiles</Text>
    </View>

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
	backButton: {
		backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
		color: Configuration.SPOTTY_PRIMARY_COLOR,
		borderRadius: 100,
		padding: 10,
	},
	container: {
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	title: {
		fontSize: 25,
		fontWeight: "bold",
	},
	location: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	placeConfig: {
		paddingVertical: 15,
		paddingHorizontal: 25,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 10,
		marginTop: 25,
		marginHorizontal: 15,
		backgroundColor: "#f5f5f5",
	},
	placeConfigItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
		alignItems: "center"
	},
	placeConfigItemText: {
		fontSize: 13,
	},
});

const statCardStyle = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 15,
        backgroundColor: "#f5f5f5",
    },
    icon: {
        fontSize: 20,
        padding: 10,
        margin: 5,
        borderRadius: 100,
        alignSelf: "flex-start"
    },
    statValue: {
        fontWeight: "bold",
        fontSize: 25,
    }
}); 

	const withdrawStyles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#d9ead3",
        backgroundColor: "#f1f8f5",
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 15,
        marginTop: 25,
        marginBottom: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        gap: 10
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2e7d32",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "#555",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },
    label: {
        fontSize: 14,
        color: "#333"
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000"
    },
    commission: {
        fontSize: 14,
        color: "red",
        fontWeight: "600"
    },
    receiveLabel: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: "bold",
        color: "#333"
    },
    receiveValue: {
        fontSize: 24,
        color: "#2e7d32",
        fontWeight: "bold",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#1F3C88",
        paddingVertical: 15,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 5
    },
    footerText: {
        color: "green",
        fontSize: 12
    }
});

